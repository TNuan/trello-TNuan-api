import express from 'express'
import { UserController } from '*/controllers/user.controller'
import { UserValidation } from '*/validations/user.validation'
import passport from 'passport'
import '../../middlewares/passport'


const router = express.Router()

router.route('/register')
  .post(UserValidation.register, UserController.register)

router.route('/login')
  .post(UserValidation.login, passport.authenticate('local', { session: false }), UserController.login)

router.route('/auth/google')
  .post(passport.authenticate('google-plus-token', { session: false }), UserController.authGoogle)

router.route('/auth/facebook')
  .post(passport.authenticate('facebook-token', { session: false }), UserController.authFacebook)

router.route('/secret')
  .get(passport.authenticate('jwt', { session: false }), UserController.secret)

router.route('/:id')
  .get(UserController.getAllUser)
  .put(UserValidation.update, UserController.update)

router.route('/search/:key')
  .get(UserController.searchUsers)

export const userRoutes = router
