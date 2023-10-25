import { NextFunction, Request, Response, response } from 'express'
import { request } from 'http'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = async (req: Request, res: Response) => {
  //nếu nó vào được đây, tức là đã qua được validate, đã đăng nhập thành công
  //server phải tạo ra access_token và refresh_token để đưa cho client
  const { user }: any = req
  const user_id = user._id //oObject_id
  //server phải tạo ra access_token và refresh_token để đưa cho client

  const result = await usersService.login(user_id.toString())
  return res.json({
    message: 'Login successfully',
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  //throw new Error('error test')
  const result = await usersService.register(req.body)

  return res.json({
    message: 'Register successfully',
    result
  })
}
