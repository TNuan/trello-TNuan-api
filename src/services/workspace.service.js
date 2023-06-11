import { WorkspaceModel } from '*/models/workspace.model'
import { cloneDeep } from 'lodash'
import { UserModel } from '../models/user.model'

const createNew = async (data) => {
  try {
    const newWorkspace = await WorkspaceModel.createNew(data)

    await UserModel.pushWorkspaceOrder(newWorkspace.author.toString(), newWorkspace._id.toString())
    await WorkspaceModel.pushMemberOrder(newWorkspace._id.toString(), newWorkspace.author.toString())
    return newWorkspace
  } catch (err) {
    throw new Error(err)
  }
}

const getFullWorkspace = async (workspaceId, data) => {
  try {
    const workspace = await WorkspaceModel.getFullWorkspace(workspaceId)

    if (!workspace) {
      throw new Error('Workspace not found!')
    }

    const transformWorkspace = cloneDeep(workspace)
    // Filter deleted boards
    if ( data.userId === transformWorkspace.author ) {
      transformWorkspace.boards = transformWorkspace.boards.filter(board => !board._destroy)
    } else {
      transformWorkspace.boards = transformWorkspace.boards.filter(board => board.userOrder.find(id => id === data.userId) && !board._destroy)
    }

    return transformWorkspace
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    if (updateData._id) delete updateData._id
    if (updateData.members) delete updateData.memebers

    const updatedWorkspace = await WorkspaceModel.update(id, updateData)

    return updatedWorkspace
  } catch (err) {
    throw new Error(err)
  }
}


export const WorkspaceService = {
  createNew,
  update,
  getFullWorkspace
}
