import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'

class UsersService {
  //hàm nhận vào user_id và bỏ vào payload để tạo access_token
  //hàm nhận vào user_id và bỏ vào payload để tạo refresh_token

  private signAccessToken(user_id: string) {
    return signToken({
      payLoad: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCCESS_TOKEN_EXPIRE_IN }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payLoad: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }

  async checkEmailExit(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async register(payLoad: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payLoad,
        date_of_birth: new Date(payLoad.date_of_birth),
        password: hashPassword(payLoad.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return { access_token, refresh_token }
  }
}

const usersService = new UsersService()
export default usersService
