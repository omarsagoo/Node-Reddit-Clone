
module.exports = function(app) {
    // Models
    const Post = require('../models/post')
    const Comment = require('../models/comment')
    const User = require('../models/user')


    // CREATE Comment
app.post("/posts/:postId/comments", function(req, res) {
    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment(req.body)
    comment.author = req.user._id
  
    // SAVE INSTANCE OF Comment MODEL TO DB
    comment
      .save()
      .then(comment => {
        return Post.findById(req.params.postId)
      })
      .then(post => {
        post.comments.unshift(comment)
        post.save()

        return User.findOne({"username": req.user.username})
      })
      .then(user => {
        user.comments.unshift(comment)
        user.save()
        
        res.redirect(`/posts/`+ req.params.postId)
      })
      .catch(err => {
        console.log(err)
      })
  })
}