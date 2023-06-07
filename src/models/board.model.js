import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'
import { ColumnModel } from './column.model'
import { CardModel } from './card.model'

//Degine Board Collection
const boardCollectionName = 'boards'
const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
  author: Joi.string().required(),
  userOrder: Joi.array().items(Joi.string()).default([]),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)
    const insertValue = {
      ...validatedValue,
      author: ObjectId(validatedValue.author)
    }
    await getDB().collection(boardCollectionName).insertOne(insertValue)
    return insertValue
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    const result = await getDB().collection(boardCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnOriginal: false }
    )
    return result.value
  } catch (err) {
    throw new Error(err)
  }
}


/**
 *
 * @param {string} boardId
 * @param {string} columnId
 */
const pushColumnOrder = async (boardId, columnId) => {
  try {
    const result = await getDB().collection(boardCollectionName).findOneAndUpdate(
      { _id: ObjectId(boardId) },
      { $push: { columnOrder: columnId } },
      { returnOriginal: false }
    )

    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

/**
 *
 * @param {string} boardId
 * @param {string} userId
 */
const pushUserOrder = async (boardId, userId) => {
  try {
    const result = await getDB().collection(boardCollectionName).findOneAndUpdate(
      { _id: ObjectId(boardId) },
      { $push: { userOrder: userId } },
      { returnOriginal: false }
    )

    return result.value
  } catch (err) {
    throw new Error(err)
  }
}


const getFullBoard = async (boardId) => {
  try {
    const result = await getDB().collection(boardCollectionName).aggregate([
      { $match: {
        _id: ObjectId(boardId),
        _destroy: false
      } },
      { $lookup: {
        from: ColumnModel.columnCollectionName, // collection name
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        from: CardModel.cardCollectionName, // collection name
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } }
    ]).toArray()

    return result[0] || {}
  } catch (err) {
    throw new Error(err)
  }
}

export const BoardModel = {
  boardCollectionName,
  createNew,
  pushColumnOrder,
  pushUserOrder,
  getFullBoard,
  update
}

