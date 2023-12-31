import jwt from 'jsonwebtoken'

//lamf hamf nhan vao payload, privateKey, options từ đó ký tên
export const signToken = ({
  payLoad,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payLoad: string | object | Buffer
  privateKey?: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payLoad, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}
