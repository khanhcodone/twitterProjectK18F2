import { NextFunction, Request, Response, response } from 'express'
import { request } from 'http'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, LogoutReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import { ErrorWithStatus } from '~/models/Errors'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  //nếu nó vào được đây, tức là đã qua được validate, đã đăng nhập thành công
  //server phải tạo ra access_token và refresh_token để đưa cho client
  const user = req.user as User
  const user_id = user._id as ObjectId //oObject_id
  //server phải tạo ra access_token và refresh_token để đưa cho client

  const result = await usersService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  //throw new Error('error test')
  const result = await usersService.register(req.body)

  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  //logout sex nhajan vao refresh_token de tim va xoa
  const result = await usersService.logout(refresh_token)
  res.json(result)
}
