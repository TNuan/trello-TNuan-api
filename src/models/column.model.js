import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'

//Degine Column Collection
const columnCollectionName = 'columns'
const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(), // Also ObjectId when create new 
  title: Joi.string().required().min(3).max(20).trim(),
  cardOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  return await columnCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)
    const insertValue = {
      ...validatedValue,
      boardId: ObjectId(validatedValue.boardId)
    }
    await getDB().collection(columnCollectionName).insertOne(insertValue)
    // console.log(insertValue)
    return insertValue
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * 
 * @param {string} columnId 
 * @param {string} cardId 
 */
 const pushCardOrder = async (columnId, cardId) => {
  try {
    const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
      { _id: ObjectId(columnId) },
      { $push: { cardOrder: cardId } },
      { returnOriginal: false }
    )

    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: data },
      { returnOriginal: false }
    )
    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

export const ColumnModel = {
  columnCollectionName,
  createNew,
  pushCardOrder,
  update
}

