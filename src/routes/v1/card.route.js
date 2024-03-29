import express from 'express'
import { CardController } from '*/controllers/card.controller'
import { CardValidation } from '*/validations/card.validation'

const router = express.Router()

router.route('/')
  .post(CardValidation.createNew, CardController.createNew)

router.route('/:id')
  .put(CardController.update, CardController.update)

router.route('/getmany')
  .post(CardController.getAllCardWorkspaces)

export const cardRoutes = router
