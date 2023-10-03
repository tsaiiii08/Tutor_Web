const express = require('express')
const router = express.Router()
const lessonController = require('../../controllers/pages/lesson-controller')
router.get('/lessons', lessonController.getLessons)
router.use('/', (req, res) => res.redirect('/lessons'))

module.exports = router