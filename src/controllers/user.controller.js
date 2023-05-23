import { UserService } from '*/services/user.service'
import { HttpStatusCode } from '*/utilities/constants'

const register = async (req, res) => {
  try {
    const result = await UserService.register(req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    console.error(err)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

const login = async (req, res) => {
  try {
    const result = await UserService.login(req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

const getAllBoard = async (req, res) => {
  try {
    const { id } = req.params
    const result = await UserService.getAllBoard(id)
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
    const result = await UserService.update(id, req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

export const UserController = {
  register,
  login,
  getAllBoard,
  update
}
