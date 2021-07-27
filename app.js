const express = require('express')
var app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const { v4: uuid } = require('uuid');
const methodOverride = require('method-override');
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require("body-parser")

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

nunjucks.configure(['views'], {
  autoescape: true,
  express: app
});

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "html")
app.set('port', process.env.PORT || 3000);

const Posts = require('./models/post');

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
res.render('pages/index', {posts: posts});
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

app.get('/posts/new', async (req, res) => {
 res.render('pages/new');
 })

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id)
  res.render('pages/show', { post })
  })

app.get('/posts/:id/edit', async (req, res) => {
    const { id } = req.params;
    const post = await Posts.findById(id)
    res.render('pages/edit', { post })
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

app.delete('/posts/comment/:id', async (req, res) => {
  const { id } = req.params;
  const foundPost = await Posts.findByIdAndDelete({id});
  console.log(foundPost);
  res.redirect('/');
})

app.listen(port, () => {
  console.log("APP IS LISTENING ON PORT 3000!")
})

// Express Configuration

