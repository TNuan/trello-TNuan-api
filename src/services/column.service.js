import { ColumnModel } from '*/models/column.model'

const createNew = async (data) => {
  try {
    const result = await ColumnModel.createNew(data)
    // push notifications
    // do something ...
    // transform data

    return result
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
    const result = await ColumnModel.update(id, updateData)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

export const ColumnService = {
  createNew,
  update
}
