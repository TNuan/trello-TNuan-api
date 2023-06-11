import express from 'express'
import { WorkspaceController } from '*/controllers/workspace.controller'
import { WorkspaceValidation } from '*/validations/workspace.validation'

const router = express.Router()

router.route('/')
  .post(WorkspaceValidation.createNew, WorkspaceController.createNew)

router.route('/:id')
  .get(WorkspaceController.getFullWorkspace)

export const workspaceRoutes = router
