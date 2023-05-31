import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { env } from '../config/environment'
import { UserModel } from '../models/user.model'
import { compare } from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'
import GooglePlusTokenStrategy from 'passport-google-plus-token'

// Passport configuration
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: env.JWT_SECRET
}, async (payload, done) => {
  try {
    console.log(payload)
    const user = await UserModel.findById(payload.sub)

    if (user) return done(null, false)

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
    const user = await UserModel.findOne({ username: username })
    if (!user) return done(null, false)

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) return done(null, false)

    done(user, true)
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
    const user = await UserModel.findOne({
      authType: 'google',
      authGoogleID: profile.id
    })
    console.log(user)

    if (user) return done(null, user)

    //
    const newUser = await UserModel.createNew({
      authType: 'google',
      authGoogleID: profile.id,
      email: profile.emails[0].value
    })

    done(null, newUser)
  } catch (err) {
    done(err, false)
  }
}))
