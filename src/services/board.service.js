import { BoardModel } from '*/models/board.model'
import { cloneDeep } from 'lodash'

const createNew = async (data) => {
  try {
    const result = await BoardModel.createNew(data)
    // push notifications
    // do something ...
    // transform data

    return result
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
    // Sort columns by column order, sort cards by card order ====> This step will pass to front end dev :V

    // Remove cards data from boards
    delete transformBoard.cards
    //
    return transformBoard
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export const BoardService = {
  createNew,
  getFullBoard
}