module.exports = (app) => {

    // Models
    const Post = require('../models/post');
    const User = require('../models/user');

    // CREATE
    app.post("/posts/new", (req, res) => {
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id
        
            post.save()
            .then(post => {
                return User.findById(req.user._id)
            })
            .then(user => {
                user.posts.unshift(post)
                user.save()
                res.redirect('/')
            })
        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });

    // NEW
    app.get("/posts/new", (req, res) => {
        var currentUser = req.user

        res.render("post-new", {currentUser})
    })

    app.get("/posts/:id", (req, res) => {
        var currentUser = req.user
        // LOOK UP THE POST
        Post.findById(req.params.id).lean().populate("author")
        .then(post => {
            res.render("posts-show", { post, currentUser })
        })
        .catch(err => {
            console.log(err.message)
        })
    })

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        var currentUser = req.user
        Post.find({ subreddit: req.params.subreddit }).lean()
        .then(posts => {
            res.render("posts-index", { posts, currentUser })
        })
        .catch(err => {
            console.log(err)
        })
    })
}