import express from 'express'
import { UserController } from '*/controllers/user.controller'
import { UserValidation } from '*/validations/user.validation'

const router = express.Router()

router.route('/register')
  .post(UserValidation.register, UserController.register)

router.route('/login')
  .post(UserValidation.login, UserController.login)

export const userRoutes = router
