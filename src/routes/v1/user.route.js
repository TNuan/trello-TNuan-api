import express from 'express'
import { UserController } from '*/controllers/user.controller'
import { UserValidation } from '*/validations/user.validation'

const router = express.Router()

router.route('/register')
  .post(UserValidation.register, UserController.register)

export const userRoutes = router
