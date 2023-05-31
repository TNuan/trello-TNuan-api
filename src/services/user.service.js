import { UserModel } from '*/models/user.model'
import { cloneDeep } from 'lodash'
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { env } from '../config/environment'
// import { HttpStatusCode } from '*/utilities/constants'

const encodeToken = (userId) => {
  return sign({
    iss: 'TNuan',
    sub: userId,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 7)
  }, env.JWT_SECRET)
}

const register = async (data) => {
  try {
    const { username, email, password } = data
    const usernameCheck = await UserModel.findOne(username)
    if (usernameCheck) return { msg: 'User already used', status: false }
    const emailCheck = await UserModel.findOne(email)
    if (emailCheck) return { msg: 'Email already used', status: false }

    const hashedPassword = await hash(password, 10)
    const user = await UserModel.createNew({
      username,
      email,
      password: hashedPassword
    })

    // Encode a token
    const token = encodeToken(user.insertedId)

    delete user.password

    return { status: true, token }
  } catch (err) {
    throw new Error(err)
  }
}

const login = async (data) => {
  try {
    const { username, password } = data
    // Check user
    const user = await UserModel.findOne(username)
    if (!user) return { msg: 'Incorrect username', status: false }
    // Check Password
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) return { msg: 'Incorrect password', status: false }

    // Encode a token
    const token = encodeToken(user.insertedId)

    delete user.password
    return { status: true, user, token }
  } catch (err) {
    throw new Error(err)
  }
}

const getAllBoard = async (userId) => {
  try {
    const user = await UserModel.getAllBoard(userId)

    if (!user || !user.boards) {
      throw new Error('Board not found!')
    }

    const transformUser = cloneDeep(user)
    // Filter deleted boards
    transformUser.boards = transformUser.boards.filter(board => !board._destroy)

    return transformUser
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export const UserService = {
  register,
  login,
  getAllBoard
}