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

app.use(async (req, res, next) => {
  res.locals.currentUser = req.session.user_id;
  const loggedUser = await Users.findById(req.session.user_id);
  res.locals.loggedUser = loggedUser;
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

const getKeywords = async () => {
  const posts = await Posts.find({});
  const keywordsList = [];
  posts.forEach((post) => {
    keywordsList.push(...post.keywords);
  });
  const keywords = new Set(keywordsList);
  return keywords;
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
  const keywords = await getKeywords();
  const loggedUser = await Users.findById(req.session.user_id);
  res.render("pages/index", { posts, tags, keywords, users, loggedUser });
});

app.get('/getData', async function(req, res) {
  const posts = await Posts.find({}).populate("author");
  console.log(posts);
  res.json(posts);
})

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
  const postsFromUser = await Posts.find({ author: user._id })
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author");
  res.render("pages/dashboard", { user, postsFromUser });
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id)
    .populate({ path: "comments", populate: { path: "author" } })
    .populate({ path: "stars", populate: { path: "author" } })
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
  const postsWithTag = await Posts.find({ tags: tag })
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author")
    .exec();
  res.render("pages/tag", {
    posts: posts,
    tag: tag,
    postsWithTag: postsWithTag,
  });
});

app.get("/keywords/:keyword", async (req, res) => {
  const posts = await Posts.find({});
  const { keyword } = req.params;
  const postsWithKeyword = await Posts.find({ keywords: keyword });
  res.render("pages/tag", {
    posts: posts,
    keyword,
    postsWithTag: postsWithKeyword,
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
    $push: { comments: { title, author } },
  })
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author");
  await added.save();
  res.redirect(`/posts/${id}`);
});

app.post("/posts/:id/stars", requireLogin, async (req, res) => {
  const { id } = req.params;
  const currentUser = res.locals.currentUser;
  let { stars } = req.body;
  stars = Number(stars.stars);

  const post = await Posts.findById(id);

  let totalStars = 0;
  for (let i = 0; i < post.stars.length; i++) {
    totalStars += post.stars[i].stars;
  }
  totalStars = totalStars / post.stars.length;
  totalStars = Math.floor(totalStars);
  post.totalStars = totalStars;
  await post.save();

  //first check if the user is the owner of the text. If so, return
  if (post.author.equals(req.session.user_id)) {
    console.log("You are the author of this text");
    return res.redirect(`/posts/${id}`);
  }

  //first check if this user already has a rating added.

  let alreadyAdded = post.stars.filter((review) => {
    return review.author._id.equals(req.session.user_id);
  });

      //find the index where the star is located to change the amount
  var index = post.stars.indexOf(alreadyAdded);

  let index2 = post.stars.findIndex( star => star.author._id === req.session.user_id );



  console.log("this is already added: " + alreadyAdded, index);

  //If not, then go ahead and add the ratings
  if (!alreadyAdded.length) {
    console.log("you have not added a review yet");
    const added = await Posts.findByIdAndUpdate(id, {
      $push: { stars: { stars, author: currentUser } },
    })
      .populate({ path: "stars", populate: { path: "author" } })
      .populate("author");
    const result = await added.save();
    res.redirect(`/posts/${id}`);
  } else {
    //if so, then replace the rating based on the id
    console.log("you already have added a review!");
    const { stars: newStar } = req.body;
    const newStarPost = Number(newStar.stars);
    //find the right object.
    const starsId = alreadyAdded[0]._id;

    //change the value
    
    post.stars[1].stars = newStarPost
    const res = await post.save();
  
    res.redirect(`/posts/${id}`);
  }

  //
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
