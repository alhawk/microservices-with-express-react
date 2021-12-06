import express, {Request, Response} from 'express'
import {currentUser} from '@hawkab/common'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, async (req: Request, res: Response) => {
  res.status(200).json({currentUser: req.currentUser || null})
})

export {router as currentUserRouter}