import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import {User} from '../models/user'
import {BadRequestError, validateRequest} from '@hawkab/common'
import {Password} from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signin', [
    body('email').notEmpty().withMessage('Email cannot be empty'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {email, password} = req.body

    const existingUser = await User.findOne({email})
    if(!existingUser) {
      throw new BadRequestError('Wrong email or password')
    }

    const passwordMatch = await Password.compare(existingUser.password, password)
    if (!passwordMatch) {
      throw new BadRequestError('Wrong email or password')
    }

    const userJWT = await jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!)
  
    // Save on session
    req.session = {
      jwt: userJWT
    }

    res.status(200).json(existingUser)
})

export {router as signInRouter}