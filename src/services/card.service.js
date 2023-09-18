import { CardModel } from '*/models/card.model'
import { ColumnModel } from '*/models/column.model'
import { uploadToCloudinary } from '../config/cloudinary'

const createNew = async (data) => {
  try {
    const newCard = await CardModel.createNew(data)
    await ColumnModel.pushCardOrder(newCard.columnId.toString(), newCard._id.toString())
    // push notifications
    // do something ...
    // transform data

    return newCard
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    let fileAttachmentData = {}
    let updateData = {
      ...data,
      updatedAt: Date.now()
    }
    if (data.fileAttachment.base64EncodedImage) {
      const results = await uploadToCloudinary(data.fileAttachment.base64EncodedImage, 'card-attchment')
      fileAttachmentData = results

      updateData = {
        ...data,
        fileAttachment: {
          filename: data.fileAttachment.filename,
          ...fileAttachmentData
        },
        updatedAt: Date.now()
      }
    }

    if (updateData._id) delete updateData._id

    const updatedCard = await CardModel.update(id, updateData)

    return updatedCard
  } catch (err) {
    throw new Error(err)
  }
}

const getAllCardWorkspaces = async (data) => {
  try {
    const cards = await CardModel.getAllCardWorkspaces(data.boardOrder)

    return cards
  } catch (err) {
    throw new Error(err)
  }
}

export const CardService = {
  createNew,
  update,
  getAllCardWorkspaces
}
