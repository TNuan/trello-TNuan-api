import express from 'express'
import { HttpStatusCode } from '*/utilities/constants'
import { boardRoutes } from './board.route'
import { columnRoutes } from './column.route'
import { cardRoutes } from './card.route'
import { userRoutes } from './user.route'
import { workspaceRoutes } from './workspace.route'

const router = express.Router()

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/**
 * User APIs
 */
router.use('/users', userRoutes)

/**
 * Workspace APIs
 */
router.use('/workspaces', workspaceRoutes)

/**
 * Board APIs
 */
router.use('/boards', boardRoutes)

/**
 * Column APIs
 */
router.use('/columns', columnRoutes)

/**
 * Card APIs
 */
router.use('/cards', cardRoutes)

/**
 * Test API
 */
// router.use('/tests', testRoutes)

export const apiV1 = router
