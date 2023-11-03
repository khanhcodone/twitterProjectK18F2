import { NextFunction, Request, Response, response } from 'express'
import { request } from 'http'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, LogoutReqBody, RegisterReqBody, TokenPayLoad } from '~/models/requests/User.requests'
import { ErrorWithStatus } from '~/models/Errors'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

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

export const emailVerifyController = async (req: Request, res: Response, next: NextFunction) => {
  // const { email_verify_token } = req.body
  // const user = await databaseService.users.findOne({ email_verify_token: email_verify_token })
  //ta có thể tìm user thông qua email_verify_token do người dùng gui lên lên thế này nhưng hiệu năng sẽ kém
  //nên thay vào đó ta sẽ lấy thông tin _id của user từ decoded_email_verify_token mà ta thu đc từ middleware trước
  //và tìm user thông qua _id đó
  const { user_id } = req.decoded_email_verify_token as TokenPayLoad
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  }) //hiệu năng cao hơn
  //nếu k có user thì cho lỗi 404: not found

  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu mà email_verify_token là rỗng: tức là account đã đc verify email trước đó rồi
  //thì mình sẽ trả về status 200 ok, với message là đã verify email trước đó rồi
  //chứ không trả về lỗi, nếu k thì client sẽ bối rối
  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    //mặc định là status 200
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.verifyEmail(user_id)
  //để cập nhật lại email_verify_token thành rỗng và tạo ra access_token và refresh_token mới
  //gữi cho người vừa request email verify đang nhập
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result: result
  })
}
