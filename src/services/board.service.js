import { BoardModel } from '*/models/board.model'

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
    // Add card to each column 
    board.columns.forEach(column => {
      column.cards = board.cards.filter(c => c.columnId.toString() === column._id.toString())

    })
    // Sort columns by column order, sort cards by card order ====> This step will pass to front end dev :V

    // Remove cards data from boards 
    delete board.cards
    // 
    return board 
  } catch (err) {
    throw new Error(err)
  }
}

export const BoardService = { 
  createNew,
  getFullBoard 
} 
