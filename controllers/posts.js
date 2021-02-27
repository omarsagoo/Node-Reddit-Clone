

module.exports = (app) => {

    // Models
    const Post = require('../models/post')

    // CREATE
    app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        const post = new Post(req.body)

        // SAVE INSTANCE OF POST MODEL TO DB
        post.save((err, post) => {
            // REDIRECT TO THE ROOT
            return res.redirect(`/`)
        })
    })

    // NEW
    app.get("/posts/new", (req, res) => {
        res.render("post-new")
    })

    app.get("/posts/:id", (req, res) => {
        // LOOK UP THE POST
        Post.findById(req.params.id).lean().populate('comments')
        .then(post => {
            res.render("posts-show", { post })
        })
        .catch(err => {
            console.log(err.message)
        })
    })

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        Post.find({ subreddit: req.params.subreddit }).lean()
        .then(posts => {
            res.render("posts-index", { posts })
        })
        .catch(err => {
            console.log(err)
        })
    })
}