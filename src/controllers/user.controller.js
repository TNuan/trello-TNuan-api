import { UserService } from '*/services/user.service'
import { HttpStatusCode } from '*/utilities/constants'

const register = async (req, res) => {
  try {
    console.log(req.body)
    const result = await UserService.register(req.body)
    res.setHeader('Authorization', 'Bearer ' + result.token)
    res.status(HttpStatusCode.OK).json({ status: result.status })
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

const authGoogle = async (req, res) => {
  console.log('authGoogle: ', req.user)
}

const authFacebook = async (req, res) => {
  console.log('authFacebook: ', req.user)
}

const login = async (req, res) => {
  try {
    const result = await UserService.login(req.body)
    res.setHeader('Authorization', result.token)
    res.status(HttpStatusCode.OK).json({ status: result.status })
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

export const UserController = {
  register,
  authGoogle,
  authFacebook,
  login,
  getAllBoard
}
