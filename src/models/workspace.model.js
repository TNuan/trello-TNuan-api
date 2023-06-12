import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'
import { BoardModel } from './board.model'
import { UserModel } from './user.model'

//Degine workspace Collection
const workspaceCollectionName = 'workspaces'
const workspaceCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
  author: Joi.string().required(),
  memberOrder: Joi.array().items(Joi.string()).default([]),
  boardOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  return await workspaceCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)
    const insertValue = {
      ...validatedValue,
      author: ObjectId(validatedValue.author)
    }
    await getDB().collection(workspaceCollectionName).insertOne(insertValue)
    return insertValue
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    const result = await getDB().collection(workspaceCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    console.log(result)
    return result.value
  } catch (err) {
    throw new Error(err)
  }
}


/**
 *
 * @param {string} workspaceId
 * @param {string} boardId
 */
const pushBoardOrder = async (workspaceId, boardId) => {
  try {
    const result = await getDB().collection(workspaceCollectionName).findOneAndUpdate(
      { _id: ObjectId(workspaceId) },
      { $push: { boardOrder: boardId } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

/**
 *
 * @param {string} workspaceId
 * @param {string} userId
 */
const pushMemberOrder = async (workspaceId, userId) => {
  try {
    const result = await getDB().collection(workspaceCollectionName).findOneAndUpdate(
      { _id: ObjectId(workspaceId) },
      { $push: { memberOrder: userId } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

const getFullWorkspace = async (workspaceId) => {
  try {
    const result = await getDB().collection(workspaceCollectionName).aggregate([
      {
        $match: {
          _id: ObjectId(workspaceId),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: BoardModel.boardCollectionName, // collection name
          localField: '_id',
          foreignField: 'workspaceId',
          as: 'boards'
        }
      },
      {
        $lookup: {
          from: UserModel.userCollectionName, // collection name
          let: { memberOrder: '$memberOrder' },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $in: [
                    '$_id',
                    { $map: {
                      input: '$$memberOrder',
                      as: 'id',
                      in: { $toObjectId: '$$id' }
                    } }
                  ]
                }
              }
            }
          ],
          as: 'members'
        }
      }
    ]).toArray()

    return result[0] || {}
  } catch (err) {
    throw new Error(err)
  }
}

export const WorkspaceModel = {
  workspaceCollectionName,
  createNew,
  update,
  pushBoardOrder,
  pushMemberOrder,
  getFullWorkspace
}

