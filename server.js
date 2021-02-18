const express = require("express")
const app = express()


const exphb = require("express-handlebars")
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Set db
require('./data/reddit-db');

// Models
const Post = require('./models/post');


// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

require('./controllers/posts.js')(app);

app.engine("handlebars", exphb({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get("/", (req, res) => {
    Post.find({}).lean()
    .then(posts => {
      res.render('posts-index', { posts });
    })
    .catch(err => {
      console.log(err.message);
    })
})

// Start Server
app.listen(3000, () => {
    console.log(`app listening on port ${3000}!`)
})

module.exports = app;