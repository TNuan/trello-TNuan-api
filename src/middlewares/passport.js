import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { env } from '../config/environment'
import { UserModel } from '../models/user.model'
import { compare } from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'
import GooglePlusTokenStrategy from 'passport-google-plus-token'

// Passport configuration
passport.use(new Strategy({
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
passport.use(new LocalStrategy({
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

// Passport Google
passport.use(new GooglePlusTokenStrategy({
  clientID: '442665719023-tt0o0rmo65dhaqs86n48nhubbjtfsplq.apps.googleusercontent.com',
  clientSecret: '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',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken: ', accessToken)
    console.log('refreshToken: ', refreshToken)
    console.log('profile: ', profile)
  } catch (err) {
    done(err, false)
  }
}))
