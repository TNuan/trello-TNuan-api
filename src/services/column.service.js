import { CardModel } from '*/models/card.model'
import { ColumnModel } from '*/models/column.model'
import { BoardModel } from '*/models/board.model'

const createNew = async (data) => {
  try {
    // transaction mongodb
    const newColumn = await ColumnModel.createNew(data)
    newColumn.cards = []

    // Update columnOrder Array in BoardCollection
    await BoardModel.pushColumnOrder(newColumn.boardId.toString(), newColumn._id.toString())

    return newColumn
  } catch (err) {
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
    if (updateData.cards) delete updateData.cards

    const updatedColumn = await ColumnModel.update(id, updateData)

    if (updatedColumn._destroy) {
      // Delete many cards in this column
      CardModel.deleteMany(updatedColumn.cardOrder)
    }

    return updatedColumn
  } catch (err) {
    throw new Error(err)
  }
}

export const ColumnService = {
  createNew,
  update
}
