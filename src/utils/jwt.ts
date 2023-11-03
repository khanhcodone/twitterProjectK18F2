import jwt, { JwtPayload } from 'jsonwebtoken'
import { resolve } from 'path'
import { TokenPayLoad } from '~/models/requests/User.requests'

//lamf hamf nhan vao payload, privateKey, options từ đó ký tên
export const signToken = ({
  payLoad,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payLoad: string | object | Buffer
  privateKey: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payLoad, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}

//hàm nhận vào token, và secretOrPublicKey?
export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayLoad>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayLoad)
    })
  })
}
