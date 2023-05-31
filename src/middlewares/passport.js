import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { env } from '../config/environment'
import { UserModel } from '../models/user.model'
import { compare } from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'

export const passportConfig = passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: env.JWT_SECRET
}, async (payload, done) => {
  try {
    console.log(payload)
    const user = await UserModel.findById(payload.sub)

    if (!user) return done(null, false)

    done(null, user)
  } catch (err) {
    done(err, false)
  }
}))

// Passport Local
export const passportLocal = passport.use(new LocalStrategy({
  usernameField: 'username'
}, async (username, password, done) => {
  try {
    const user = await UserModel.findOne(username)
    if (!user) return done(null, false)

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) return done(null, false)

    done(null, user)
  } catch (err) {
    done(err, false)
  }
}))
