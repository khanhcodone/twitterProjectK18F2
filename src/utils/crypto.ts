import { createHash } from 'crypto'
import { config } from 'dotenv'
config()
//tao 1 ham nhan vao chuoi la ma hoa theo chuan sha256

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

//hàm nhận vào password và trả về password đã mã hoá

export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}