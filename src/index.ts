import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 4000
initFolder()
databaseService.connect()

app.get('/', (req, res) => {
  res.send('Hello world ')
})

app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
//app.use('/static', express.static(UPLOAD_DIR))
//khoong cau hinh duoc no,
//route localhost:3000/
app.use('/static', staticRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server đang chạy trên PORT ${PORT}`)
})
