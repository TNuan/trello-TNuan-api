import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'
import { BoardModel } from './board.model'
import { UserModel } from './user.model'

//Degine Card Collection
const cardCollectionName = 'cards'
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(), // Also ObjectId when create new
  columnId: Joi.string().required(), // Also ObjectId when create new
  title: Joi.string().required().min(3).max(50).trim(),
  labelOrder: Joi.array().items(Joi.string()).default([]),
  cover: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)
    const insertValue = {
      ...validatedValue,
      boardId: ObjectId(validatedValue.boardId),
      columnId: ObjectId(validatedValue.columnId)
    }
    await getDB().collection(cardCollectionName).insertOne(insertValue)
    return insertValue
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    if (data.boardId) updateData.boardId = ObjectId(data.boardId)
    if (data.columnId) updateData.columnId = ObjectId(data.columnId)

    const result = await getDB().collection(cardCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result.value
  } catch (err) {
    throw new Error(err)
  }
}


/**
 * @param {Array of string card is} ids
 */
const deleteMany = async (ids) => {
  try {
    const tranformIds = ids.map(id => ObjectId(id))
    const result = await getDB().collection(cardCollectionName).updateMany(
      { _id: { $in: tranformIds } },
      { $set: { _destroy: true } }
    )

    return result
  } catch (err) {
    throw new Error(err)
  }
}

const getAllCardWorkspaces = async (boardIds) => {
  try {
    const result = await Promise.all(boardIds.map(async (boardId) => {
      const cards = await getDB().collection(cardCollectionName).aggregate([
        {
          $match: {
            boardId: ObjectId(boardId),
            _destroy: false
          }
        },
        { // Join bang board va lay ra thong tin board theo boardId cua card
          $lookup: {
            from: BoardModel.boardCollectionName, // collection name
            localField: 'boardId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  author: 1,
                  title: 1,
                  userOrder: 1
                }
              }
            ],
            as: 'board'
          }
        },
        { $unwind: '$board' },
        { // Join bang user va lay ra thong tin user theo userOrder cua board o tren
          $lookup: {
            from: UserModel.userCollectionName, // collection name
            let: { memberOrder: '$board.userOrder' }, 
            pipeline: [
              {
                $match:
                {
                  $expr:
                  {
                    $in: [
                      '$_id',
                      {
                        $map: {
                          input: '$$memberOrder',
                          as: 'id',
                          in: { $toObjectId: '$$id' }
                        }
                      }
                    ]
                  }
                }
              },
              {
                $project: {
                  username: 1
                }
              }
            ],
            as: 'members'
          }
        }
      ]).toArray()

      return cards
    }))

    const flattenedResult = result.flat() // Hợp nhất các mảng con thành một mảng duy nhất
    return flattenedResult
  } catch (err) {
    console.log('Error:', err)
    throw new Error(err)
  }
}


export const CardModel = {
  cardCollectionName,
  createNew,
  update,
  deleteMany,
  getAllCardWorkspaces
}