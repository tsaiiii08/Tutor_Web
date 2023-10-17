const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const lessonController = require('../../controllers/pages/lesson-controller')
const adminController = require('../../controllers/pages/admin-controller')
const userController = require('../../controllers/pages/user-controller')
const enrollmentController = require('../../controllers/pages/enrollment-controller')
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedStudent } = require('../../middleware/auth')
const upload = require('../../middleware/multer')
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email']
}))
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/signIn', failureFlash: true }), userController.signIn)
router.post('/users/signIn', passport.authenticate('local', { failureRedirect: '/users/signIn', failureFlash: true }), userController.signIn)
router.get('/users/signIn', userController.signInPage)
router.get('/users/signUp', userController.signUpPage)
router.post('/users/signUp', userController.signUp)
router.get('/users/logout', authenticated, userController.logout)
router.get('/users/becTeacher', authenticatedStudent, userController.becTeacherPage)
router.post('/users/becTeacher', authenticatedStudent, userController.becTeacher)
router.get('/users/:id/edit', authenticated, userController.editUserPage)
router.put('/users/:id/edit', authenticated, upload.single('avatar'), userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/lesson/:id', authenticated, lessonController.getLesson)
router.get('/lessons', lessonController.getLessons)
router.post('/enrollment/:lessonId', authenticated, enrollmentController.createEnroll)
router.use('/', (req, res) => res.redirect('/lessons'))
router.use('/', generalErrorHandler)

module.exports = router
