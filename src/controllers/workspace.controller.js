import { WorkspaceService } from '*/services/workspace.service'
import { HttpStatusCode } from '*/utilities/constants'

const createNew = async (req, res) => {
  try {
    const result = await WorkspaceService.createNew(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    console.error(err)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

const getFullWorkspace = async (req, res) => {
  try {
    const { userId, workspaceId } = req.params
    const result = await WorkspaceService.getFullWorkspace(workspaceId)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    console.error(err)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

export const WorkspaceController = {
  createNew,
  getFullWorkspace
}
