const express = require('express')
var app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const { v4: uuid } = require('uuid');
const methodOverride = require('method-override');
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const session = require('express-session')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));
nunjucks.configure(['views'], {
  autoescape: true,
  express: app
});
app.use(session({secret: 'not a good secret'}));

const requireLogin = (req,res,next) => {
  if(!req.session.user_id){
    return res.redirect('/login');
  }
  next();
}

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "html")
app.set('port', process.env.PORT || 3000);

const Posts = require('./models/post');
const Users = require('./models/user');

mongoose.connect('mongodb://localhost:27017/kunstKanon', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.get('/', async (req, res) => {
 const posts = await Posts.find({});
const tagList = []
 posts.forEach(post => {
   tagList.push(...post.tags);
})
const tags = new Set(tagList);
  res.render('pages/index', {posts: posts, tags:tags}) 
})


app.get('/posts', async (req, res) => {
  const posts = await Posts.find({});
 res.render('pages/index', {posts: posts});
 })

app.post('/', async (req, res) => {
  const {username, caption, image} = req.body;
  const newProduct = new Posts({username, caption, image});
  await newProduct.save();
  res.redirect(`/posts/${newProduct._id}`)
})

app.get('/posts/new', (req, res) => {
 res.render('pages/new');
 })

app.get('/login', (req, res) => {
  res.render('pages/login');
  })

app.get('/register', (req, res) => {
    res.render('pages/register');
  })


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("succesfully logged out");
})

app.post('/login', async (req, res) => {
  const {password, username} = req.body;
  const user = await Users.findOne({username})
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword){
    req.session.user_id = user.id;
    res.redirect(`./secret`)
  } else {
    res.send("try again");
  }
})

app.post('/register', async (req, res) => {
  const {password, username} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new Users({username, password: hash});
    req.session.user_id = user.id;
    await user.save();
    res.redirect("/");
    })

app.get('/secret', requireLogin, async (req, res) => {
      res.render('pages/secret');
    })

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id)
  res.render('pages/show', { post })
  })

  app.get('/tags/:tag', async (req, res) => {
    const posts = await Posts.find({});
    const { tag } = req.params;
    const postsWithTag = await Posts.find({ tags: tag }).exec();
    res.render('pages/tag', {posts: posts, tag: tag, postsWithTag:postsWithTag});
    })

app.get('/posts/:id/edit', async (req, res) => {
    const { id } = req.params;
    const post = await Posts.findById(id)
    res.render('pages/edit', { post })
})

app.post('/posts/:id/comment', async (req, res) => {
  const { id } = req.params;
  const {username, comment: title} = req.body;
  console.log(id, username,title);
  const added = await Posts.findByIdAndUpdate(id, { $push: { comments : { username, title } } });
  res.redirect(`/`);
})

app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/posts/${post._id}`);
})

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Posts.findByIdAndDelete(id);
    res.redirect('/');
})

app.delete('/posts/:id/comment/:idc', async (req, res) => {
  const { id, idc } = req.params;
  const deleted = await Posts.findByIdAndUpdate(id, { $pull: { comments : { _id: idc } } });
  res.redirect('/');
})

app.listen(port, () => {
  console.log("APP IS LISTENING ON PORT 3000!")
})

// Express Configuration

