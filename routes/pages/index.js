const express = require('express')
const router = express.Router()
const lessonController = require('../../controllers/pages/lesson-controller')
const adminController = require('../../controllers/pages/admin-controller')
router.get('/admin/users',adminController.getUsers)
router.get('/lessons', lessonController.getLessons)
router.use('/', (req, res) => res.redirect('/lessons'))

module.exports = router