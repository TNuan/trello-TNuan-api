import { UserModel } from '*/models/user.model'
import { WorkspaceService } from './workspace.service'
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
    const usernameCheck = await UserModel.findOne({ username: username })
    if (usernameCheck) return { msg: 'User already used', status: false }
    const emailCheck = await UserModel.findOne({ email: email })
    if (emailCheck) return { msg: 'Email already used', status: false }

    const hashedPassword = await hash(password, 10)
    const user = await UserModel.createNew({
      username,
      email,
      password: hashedPassword
    })

    await WorkspaceService.createNew({
      title: 'Workspace ' + username,
      author: user.insertedId.toString()
    })
    // Encode a token
    const token = encodeToken(user.insertedId.toString())

    const result = await UserModel.findOne({ _id: user.insertedId })
    delete result.password
    return {
      status: true,
      user: result,
      token
    }
  } catch (err) {
    throw new Error(err)
  }
}

const login = async (data) => {
  try {
    const { username, password } = data
    // Check user
    const user = await UserModel.findOne({ username: username })
    if (!user) return { msg: 'Incorrect username', status: false }
    // Check Password
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) return { msg: 'Incorrect password', status: false }

    // Encode a token
    const token = encodeToken(user._id.toString())

    delete user.password
    return { status: true, user, token }
  } catch (err) {
    throw new Error(err)
  }
}

const getAllUser = async (userId) => {
  try {
    const user = await UserModel.getAllUser(userId)
    return user
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    if (updateData._id) delete updateData._id

    const updatedUser = await UserModel.update(id, updateData)

    return updatedUser
  } catch (err) {
    throw new Error(err)
  }
}

const searchUsers = async (key) => {
  try {
    const user = await UserModel.searchUsers(key)
    return user
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export const UserService = {
  register,
  login,
  getAllUser,
  update,
  searchUsers
}