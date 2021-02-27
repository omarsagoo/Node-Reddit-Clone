const express = require("express")
const app = express()


const exphb = require("express-handlebars")
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

// environment variables
require('dotenv').config()

// Set db
require('./data/reddit-db')

// Models
const Post = require('./models/post')

// Use Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Use Cookie Parser
app.use(cookieParser())

// Add after body parser initialization!
app.use(expressValidator())

// check the authentication of a user from the cookies
// use it on every route
var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);


app.engine("handlebars", exphb({defaultLayout: 'main', 
                                                    helpers:{
                                                      "dateFormat": require('handlebars-dateformat'),
                                                    }
                                                  })
                                                )
app.set('view engine', 'handlebars')

// Controllers
require('./controllers/posts.js')(app)
require('./controllers/comments.js')(app)
require('./controllers/auth.js')(app)
require('./controllers/users.js')(app)


app.get("/", (req, res) => {
    var currentUser = req.user;
  
    Post.find({}).lean().populate("author")
    .then(posts => {
      res.render('posts-index', { posts, currentUser })
    })
    .catch(err => {
      console.log(err.message)
    })
})

// Start Server
app.listen(3000, () => {
    console.log(`app listening on port ${3000}!`)
})

module.exports = app