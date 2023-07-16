import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'
import { WorkspaceModel } from './workspace.model'

//Degine User Collection
const userCollectionName = 'users'
const userCollectionSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(8),
  repeat_password: Joi.ref('password'),
  authType: Joi.string().valid('local', 'facebook', 'google').default('local'),
  authGoogleID: Joi.string().default(null),
  authFacebookID: Joi.string().default(null),
  // boardOrder: Joi.array().items(Joi.string()).default([]),
  workspaceOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null)
})

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

const findOne = async (data) => {
  try {
    const result = await getDB().collection(userCollectionName).findOne(data)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

const findById = async (data) => {
  try {
    const result = await getDB().collection(userCollectionName).findOne({ _id: ObjectId(data) })
    return result
  } catch (err) {
    throw new Error(err)
  }
}

const searchUsers = async (key) => {
  try {
    const result = await getDB().collection(userCollectionName).find({
      '$or': [
        { username: { $regex: `^${key}.*`, $options: 'si' } },
        { email: { $regex: `^${key}.*@`, $options: 'si' } },
        { email: key }
      ]
    }).project({ username: 1 }).toArray()
    return result
  } catch (err) {
    throw new Error(err)
  }
}


// /**
//  * @param {string} userId
//  * @param {string} boardId
//  * @returns
//  */
// const pushBoardOrder = async (userId, boardId) => {
//   try {
//     const result = await getDB().collection(userCollectionName).findOneAndUpdate(
//       { _id: ObjectId(userId) },
//       { $push: { boardOrder: boardId } },
//       { returnDocument: 'after' }
//     )

//     return result.value
//   } catch (err) {
//     throw new Error(err)
//   }
// }


/**
 * @param {string} userId
 * @param {string} workspaceId
 * @returns
 */
const pushWorkspaceOrder = async (userId, workspaceId) => {
  try {
    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
      { _id: ObjectId(userId) },
      { $push: { workspaceOrder: workspaceId } },
      { returnDocument: 'after' }
    )

    return result.value
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
      { returnDocument: 'after' }
    )
    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

const getAllUser = async (userId) => {
  try {
    const result = await getDB().collection(userCollectionName).aggregate([
      {
        $match: {
          _id: ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: WorkspaceModel.workspaceCollectionName, // collection name
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $in: [userId, '$memberOrder']
                }
              }
            }
          ],
          as: 'workspaces'
        }
      }

    ]).toArray()

    return result[0] || {}
  } catch (err) {
    throw new Error(err)
  }
}

export const UserModel = {
  createNew,
  // pushBoardOrder,
  pushWorkspaceOrder,
  findOne,
  findById,
  getAllUser,
  update,
  searchUsers,
  userCollectionName
}
