import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express()
app.use(express.json())

const PORT = 3000
databaseService.connect()

app.get('/', (req, res) => {
  res.send('Hello world ')
})

app.use('/users', usersRouter)
//route localhost:3000/

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server đang chạy trên PORT ${PORT}`)
})
