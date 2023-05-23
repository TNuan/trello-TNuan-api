import Joi from 'joi'
import { HttpStatusCode } from '*/utilities/constants'

const register = async (req, res, next) => {
  const condition = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password: Joi.ref('password')
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(err).message
    })
    console.log(err)
  }
}

export const UserValidation = {
  register
}
