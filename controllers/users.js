
module.exports = function(app) {
    // Models
    const User = require('../models/user')

   app.get('/user/:username', (req, res) => {
       const username = req.params.username
       var currentUser = req.user

       User.findOne({username}).lean().populate("comments").populate("posts")
       .then(user => {
            res.render("profile", {user, currentUser})
       })
   })

   app.get('/profile', (req, res) => {
        var currentUser = req.user

        User.findOne({username: currentUser.username}).lean().populate("comments").populate("posts")
        .then(user => {
            if (!user) {
                return res.redirect("/")
            }
            res.render("profile", {user, currentUser})
       })
   })
}