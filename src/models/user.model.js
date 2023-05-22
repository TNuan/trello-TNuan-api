import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'
import { BoardModel } from './board.model'

//Degine User Collection
const userCollectionName = 'users'
const userCollectionSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  repeat_password: Joi.ref('password'),
  access_token: [
    Joi.string(),
    Joi.number()
  ],
  boardOrder: Joi.array().items(Joi.string().default([])),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
})
  .with('username', 'birth_year')
  .xor('password', 'access_token')
  .with('password', 'repeat_password')

const validateSchema = async (data) => {
  return await userCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const value = await validateSchema(data)
    const result = await getDB().collection(userCollectionName).insertOne(value)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
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
 * @param {string} userId
 * @param {string} boardId
 * @returns
 */
const pushBoardOrder = async (userId, boardId) => {
  try {
    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
      { _id: ObjectId(userId) },
      { $push: { boardOrder: boardId } },
      { returnOriginal: false }
    )

    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

const getAllBoard = async (userId) => {
  try {
    const result = await getDB().collection(userCollectionName).aggregate([
      { $match: {
        _id: ObjectId(userId),
        // _destroy: false
      } },
      { $lookup: {
        from: BoardModel.boardCollectionName, // collection name
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
    ]).toArray()

    return result[0] || {}
  } catch (err) {
    throw new Error(err)
  }
}

export const UserModel = {
  createNew,
  pushBoardOrder,
  getAllBoard,
  update
}
