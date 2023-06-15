import { UserService } from '*/services/user.service'
import { HttpStatusCode } from '*/utilities/constants'

const register = async (req, res) => {
  try {
    const result = await UserService.register(req.body)
    if (result.status === true) {
      res.setHeader('Authorization', result.token)
    }
    res.status(HttpStatusCode.OK).json(result)
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

const secret = async (req, res) => {
  res.status(HttpStatusCode.OK).json(req.user)
}

const login = async (req, res) => {
  try {
    const result = await UserService.login(req.body)
    if (result.status === true) {
      res.setHeader('Authorization', result.token)
    }
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: err.message
    })
  }
}

const getAllUser = async (req, res) => {
  try {
    const { id } = req.params
    const result = await UserService.getAllUser(id)
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
  authGoogle,
  authFacebook,
  login,
  secret,
  getAllUser,
  update
}
