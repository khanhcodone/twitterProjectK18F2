//file này dùng để định nghĩa lại Req truyền lên từ client
import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayLoad } from './models/requests/User.requests'
declare module 'express' {
  interface Request {
    user?: User // trong 1 request có thể có hoặc k có user
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
    decoded_email_verify_token?: TokenPayLoad
    decoded_forgot_password_token?: TokenPayLoad
  }
}

interface Request {
  user?: User
  decoded_authorization?: TokenPayload
  decoded_refresh_token?: TokenPayload
  decoded_email_verify_token?: TokenPayload
}
