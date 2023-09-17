import { BoardService } from '*/services/board.service'
import { HttpStatusCode } from '*/utilities/constants'

const createNew = async (req, res) => {
  try {
    const result = await BoardService.createNew(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    console.error(err)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

const getFullBoard = async (req, res) => {
  try {
    const { id } = req.params
    const result = await BoardService.getFullBoard(id)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    console.error(err)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const result = await BoardService.update(id, req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

// const delete = async (req, res) => {
//   try {
//     const { id } = req.params
//     const result = await BoardService.delete(id)

//   } catch (err) {
//     res.status(HttpStatusCode.INTERNAL_SERVER).json({
//       errors: err.message
//     })
//   }
// }

export const BoardController = {
  createNew,
  getFullBoard,
  update
}
