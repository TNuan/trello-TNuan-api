import express from 'express'
import { UserController } from '*/controllers/user.controller'
import { UserValidation } from '*/validations/user.validation'
import passport from 'passport'
import { passportConfig, passportLocal } from '../../middlewares/passport'


const router = express.Router()

router.route('/register')
  .post(UserValidation.register, passport.authenticate('jwt', { session: false }), UserController.register)

router.route('/login')
  .post(UserValidation.login, passport.authenticate('local', { session: false }), UserController.login)

export const userRoutes = router
