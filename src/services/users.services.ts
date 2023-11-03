import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  //hàm nhận vào user_id và bỏ vào payload để tạo access_token
  //hàm nhận vào user_id và bỏ vào payload để tạo refresh_token

  private signAccessToken(user_id: string) {
    return signToken({
      payLoad: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCCESS_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payLoad: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }
  //hàm signEmailVerifyToken
  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payLoad: { user_id, token_type: TokenType.EmailVerificationToken },
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string //thêm
    })
  }

  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async checkEmailExit(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async register(payLoad: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    const result = await databaseService.users.insertOne(
      new User({
        ...payLoad,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payLoad.date_of_birth),
        password: hashPassword(payLoad.password)
      })
    )
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id.toString())
    //luu refresh_token vao db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    //giả lập gửi email
    console.log(email_verify_token)

    return { access_token, refresh_token }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)
    //luu refresh_token vao db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }

  async verifyEmail(user_id: string) {
    //token này chứa access_token và refresh_token
    //update lại user

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) }, //tìm user thông qua _id
      [
        {
          $set: { email_verify_token: '', updated_at: '$$NOW', verify: UserVerifyStatus.Verified }
        }
        //set email_verify_token thành rỗng,và cập nhật ngày cập nhật, cập nhật status của verify
      ]
    )

    //destructuring token ra
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)
    //lưu refresg_token vào database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    //nếu họ verify thành công thì gữi họ access_token và refresh_token để họ đăng nhập luôn
    return { access_token, refresh_token }
  }
}

const usersService = new UsersService()
export default usersService
