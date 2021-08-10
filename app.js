const express = require("express");
var app = express();
const path = require("path");
const nunjucks = require("nunjucks");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const flash = require("flash");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
nunjucks.configure(["views"], {
  autoescape: true,
  express: app,
});
app.use(session({ secret: "not a good secret" }));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user_id;
  next();
});

//custom middleware

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    //store the url they are requesting!
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  if (!post.author.equals(req.session.user_id)) {
    console.log("Error, you don´t have acces to this page");
    return res.redirect(`/login`);
  }
  next();
};


//custom helperfunctions

const getTags = async () => {
  const posts = await Posts.find({});
  const tagList = [];
  posts.forEach((post) => {
    tagList.push(...post.tags);
  });
  const tags = new Set(tagList);
  return tags;
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.set("port", process.env.PORT || 3000);

const Posts = require("./models/post");
const Users = require("./models/user");

mongoose
  .connect("mongodb://localhost:27017/kunstKanon", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.get("/", async (req, res) => {
  const posts = await Posts.find({}).populate("author");
  const users = await Users.find({});
  const tags = await getTags();
  const loggedUser = await Users.findById(req.session.user_id);
  res.render("pages/index", { posts, tags, users, loggedUser });
});

app.get("/logout", async (req, res) => {
  req.session.destroy();
  const posts = await Posts.find({});
  const tags = await getTags();
  res.render("pages/index", {
    posts: posts,
    tags: tags,
    message: { title: "you are succesfully logged out" },
  });
});

app.get("/posts", async (req, res) => {
  const posts = await Posts.find({});
  res.render("pages/index", { posts: posts });
});

app.post("/", requireLogin, async (req, res) => {
  const { title, caption, image, tags } = req.body;
  const author = res.locals.currentUser;
  const newProduct = new Posts({ title, caption, image, tags });
  newProduct.author = author;
  await newProduct.save();
  res.redirect(`/posts/${newProduct._id}`);
});

app.get("/posts/new", requireLogin, async (req, res) => {
  const tags = await getTags();
  res.render("pages/new", { tags });
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post("/login", async (req, res) => {
  const returnTo = req.session.returnTo;
  const { password, username } = req.body;
  const user = await Users.findOne({ username });
  if (user === null) {
    res.render("pages/register", {
      message: { title: "There is no user by this name" },
    });
  } else {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      req.session.user_id = user.id;
      if (returnTo) {
        res.redirect(`${returnTo}`);
      } else {
        res.redirect("/account");
      }
    } else {
      res.render("pages/login", {
        message: { title: "Oops! Something went wrong, please try again" },
      });
    }
  }
});

app.post("/register", async (req, res) => {
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new Users({ username, password: hash });
  req.session.user_id = user.id;
  await user.save();
  res.redirect("/");
});

app.get("/account", requireLogin, async (req, res) => {
  const user = await Users.findById(req.session.user_id);
  const postsFromUser = await Posts.find({ author: user._id }).populate({ path: "comments", populate: { path: "author" } })
  .populate("author");
  res.render("pages/dashboard", { user, postsFromUser });
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id)
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author");
  if (!post) {
    console.log("there are no posts by this name");
    return res.redirect("/");
  } else {
    res.render("pages/show", { post });
  }
});

app.get("/tags/:tag", async (req, res) => {
  const posts = await Posts.find({}).populate("author");
  const { tag } = req.params;
  const postsWithTag = await Posts.find({ tags: tag }).populate({ path: "comments", populate: { path: "author"} }).populate("author")
.exec();
  res.render("pages/tag", {
    posts: posts,
    tag: tag,
    postsWithTag: postsWithTag,
  });
});

app.get("/authors/:author_id", async (req, res) => {
  const { author_id } = req.params;
  const posts = await Posts.find({ author: { _id: author_id } })
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author");
  res.render("pages/show", { posts });
});

app.get("/posts/:id/edit", requireLogin, isAuthor, async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  if (!post) {
    console.log("there is no post with this id");
    return res.destroy("/campgrounds");
  }
  res.render("pages/edit", { post });
});

app.post("/posts/:id/comment", async (req, res) => {
  const { id } = req.params;
  const author = res.locals.currentUser;
  const { comment: title } = req.body;
  const added = await Posts.findByIdAndUpdate(id, {
    $push: { comments: { title } },
  });
  res.redirect(`/posts/${id}`);
});

app.put("/posts/:id", requireLogin, isAuthor, async (req, res) => {
  const { id } = req.params;
  const postUpdate = await Posts.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/posts/${postUpdate._id}`);
});

app.delete("/posts/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Posts.findByIdAndDelete(id);
  res.redirect("/");
});

app.delete("/posts/:id/comment/:idc", requireLogin, async (req, res) => {
  const { id, idc } = req.params;
  const deleted = await Posts.findByIdAndUpdate(id, {
    $pull: { comments: { _id: idc } },
  });
  res.redirect(`/posts/${id}`);
});

app.listen(port, () => {
  console.log("APP IS LISTENING ON PORT 3000!");
});

// Express Configuration
