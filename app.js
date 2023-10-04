const express = require('express')
const {pages,apis} = require('./routes')
const exphbs = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const db = require('./models')
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(pages)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
module.exports = app