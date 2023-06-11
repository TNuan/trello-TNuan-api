import { BoardModel } from '*/models/board.model'
import { UserModel } from '../models/user.model'
import { WorkspaceModel } from '../models/workspace.model'
import { cloneDeep } from 'lodash'

const createNew = async (data) => {
  try {
    console.log(data)
    const newBoard = await BoardModel.createNew(data)
    console.log(newBoard)
    await UserModel.pushBoardOrder(newBoard.author.toString(), newBoard._id.toString())
    await WorkspaceModel.pushBoardOrder(newBoard.workspaceId.toString(), newBoard._id.toString())
    await BoardModel.pushUserOrder(newBoard._id.toString(), newBoard.author.toString())
    return newBoard
  } catch (err) {
    throw new Error(err)
  }
}

const getFullBoard = async (boardId) => {
  try {
    const board = await BoardModel.getFullBoard(boardId)

    if (!board || !board.columns) {
      throw new Error('Board not found!')
    }

    const transformBoard = cloneDeep(board)
    // Filter deleted columns
    transformBoard.columns = transformBoard.columns.filter(column => !column._destroy)

    // Add card to each column
    transformBoard.columns.forEach(column => {
      column.cards = transformBoard.cards.filter(c => c.columnId.toString() === column._id.toString())
    })
    // Sort columns by column order, sort cards by card order ====> This step will pass to front end dev

    // Remove cards data from boards
    delete transformBoard.cards
    //
    return transformBoard
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
    if (updateData.columns) delete updateData.columns

    const updatedBoard = await BoardModel.update(id, updateData)

    return updatedBoard
  } catch (err) {
    throw new Error(err)
  }
}

export const BoardService = {
  createNew,
  getFullBoard,
  update
}
