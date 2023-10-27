//file này dùng để định nghĩa lại Req truyền lên từ client
import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayLoad } from './models/requests/User.requests'
declare module 'express' {
  interface Request {
    user?: User // trong 1 request có thể có hoặc k có user
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
  }
}
