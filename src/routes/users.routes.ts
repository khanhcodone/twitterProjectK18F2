import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.get('/login', loginValidator, wrapAsync(loginController))

usersRouter.post('/register', registerValidator, wrapAsync(registerController))
/*
Decription: Register new user
Path: /register
Method: POST
body:{
    name: string
    email: string
    password: string
    confirm_password: string 
    date_of_birth: string theo chuan ISO 8601

    trong mongo quy uoc la snicky kphai cammmelCase
}

*/

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*
des: đăng xuất
path: /users/logout
method: POST
headers: {Authorization: 'Bearer <access_token>'}
body: {refresh_token: string}
*/

export default usersRouter
