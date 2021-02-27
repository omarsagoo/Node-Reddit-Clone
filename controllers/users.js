
module.exports = function(app) {
    // Models
    const User = require('../models/user')

   app.get('/user/:username', (req, res) => {
       const username = req.params.username
       var currentUser = req.user

       User.findOne({username}).lean().populate("comments").populate("posts")
       .then(user => {
           console.log(user.createdAt)
            res.render("profile", {user, currentUser})
       })
   })
}