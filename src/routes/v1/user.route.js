import express from 'express'
import { UserController } from '*/controllers/user.controller'
import { UserValidation } from '*/validations/user.validation'
import passport from 'passport'
import '../../middlewares/passport'


const router = express.Router()

router.route('/register')
  .post(UserValidation.register, passport.authenticate('jwt', { session: false }), UserController.register)

router.route('/login')
  .post(UserValidation.login, passport.authenticate('local', { session: false }), UserController.login)

router.route('/auth/google')
  .post(passport.authenticate('google-plus-token', { session: false }), UserController.authGoogle)

router.route('/auth/facebook')
  .post(passport.authenticate('facebook-token', { session: false }), UserController.authFacebook)

export const userRoutes = router
