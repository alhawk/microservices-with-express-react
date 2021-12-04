import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import jwt from 'jsonwebtoken'
import {BadRequestError, validateRequest} from '@hawkab/common'
import {User} from '../models/user'
const router = express.Router()

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').trim().isLength({min: 8, max: 20}).withMessage('Password must be between 8 and 20'),
  ],
  validateRequest, 
  async (req: Request, res: Response) => {
  const {email, password} = req.body
  const existingUser = await User.findOne({email})
  if (existingUser) {
    throw new BadRequestError('Email in use')
  }
  const user = User.build({email, password})
  await user.save()

  const userJWT = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!)

  // Save on session
  req.session = {
    jwt: userJWT
  }

  res.status(201).json(user)
})

export {router as signUpRouter}