const express = require("express")
const app = express()

const exphb = require("express-handlebars")

app.engine("handlebars", exphb({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get("/", (req, res) => {
    res.render("home")
})

// Start Server
app.listen(3000, () => {
    console.log(`app listening on port ${3000}!`)
  })
  