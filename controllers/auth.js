module.exports = (app) => {
    // models
    const User = require("../models/user")

    // jwts
    const jwt = require('jsonwebtoken')

    // SIGN UP FORM
    app.get("/sign-up", (req, res) => {
    var currentUser = req.user;

      res.render("sign-up", {currentUser})
    })

    // LOGIN FORM
    app.get('/login', (req, res) => {

        res.render('login')
    })

    // FORGOT PASSWORD FORM
    app.get('/forgot-password',(req, res) => {
        res.render("password-forget", {currentUser})
    })

    // PASSWORD CHANGE LINK PAGE
    app.get('/password-change/:token', (req, res) => {
        let link = req.headers.host + '/password-update/' + req.params.token
        res.render("password-change-link", { link, currentUser })
    })

    // PASSWORD UPDATE FORM
    app.get('/password-update/:token', (req, res) => {
        var currentUser = req.User
        const resetPasswordToken = req.params.token
        // verify a token symmetric
        jwt.verify(resetPasswordToken, process.env.SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).send({ message: "Token Expired!" })
            }

            res.render('password-update', { token: resetPasswordToken, currentUser})
        });
    })

    // LOGOUT
    app.get('/logout', (req, res) => {
        res.clearCookie("ntoken", {path: '/', domain: 'localhost'})
        res.redirect("/login")
    })

    // SIGN UP POST
    app.post("/sign-up", (req, res) => {
        // Create User and JWT
        const user = new User(req.body)

        if (req.body.password != req.body.confirm) {
            return res.status(401).send({ message: "Passwords do not match!" })
        }
    
        user
        .save()
        .then(user => {
            var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" })
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true, path: '/', domain: 'localhost' })
            res.redirect('/')
        })
        .catch(err => {
            console.log(err.message)
            return res.status(400).send({ err: err })
        })
    })

    // LOGIN
    app.post("/login", (req, res) => {
        const username = req.body.username
        const password = req.body.password

        // Find this user name
        User.findOne({ username }, "username password")
        .then(user => {
            if (!user) {
                // User not found
                return res.status(401).send({ message: "Wrong Username or Password" })
            }
            // Check the password
            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    // Password does not match
                    return res.status(401).send({ message: "Wrong Username or password" })
                }

                if (req.body.remember == "on") {
                    // Create a token
                    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                        expiresIn: "60 days"
                    })
                    // Set a cookie and redirect to root
                    res.cookie("nToken", token, { maxAge: 900000, httpOnly: true, path:'/' })
                }
        
                res.redirect("/")
            })
        })
        .catch(err => {
            console.log(err)
        })
    })

    // FORGOT PASSWORD POST
    app.post('/forgot-password', (req, res) => {
        const username = req.body.username

        User.findOne({ username }, "username password")
        .then(user => {
            if (!user) {
                return res.status(401).send({ message: "User not found" })
            }

            const resetToken = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                expiresIn: "1h" // Expires in 1 hour
            })

            res.redirect('/password-change/' + resetToken)
        })
        .catch(err => {
            console.log(err)
        })
    })

    // UPDATE PASSWORD
    app.post('/update-password/:token', (req, res) => {
        const token = req.params.token
        const username = req.body.username
        const password = req.body.password
        const confirm = req.body.confirm

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).send({ message: "Token Expired!" })
            }

            if (username != decoded.username) {
                return res.redirect("/login")
            }

            if (password != confirm) {
                return res.status(401).send({ message: "Passwords do not match!" })
            }

            User.findOne({ username }, "username password")
            .then(user => {
                if (!user) {
                    return res.status(401).send({ message: "User not found" })
                }
    
                user.updatePassword(password,  (done => {
                    if (done) {
                        res.redirect('/login')
                    }
                }))
                
            })
            .catch(err => {
                console.log(err)
            })
        });
    })
}