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

export const BoardService = { createNew }
