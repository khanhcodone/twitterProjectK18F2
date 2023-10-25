import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
// can be reused by many routes
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    //lấy lỗi ra lưu trong req, lôi ra giống demo
    //nhan dc 1 middleware, lay loi trong req, ko co next, co thi res quang loi 400
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      //lấy msg của từng lỗi ra
      const { msg } = errorObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      //nếu xuống đc ddaya thì này là lỗi 422
      entityError.errors[key] = msg
    }
    //xử lý lỗi luôn
    next(entityError)

    //res.status(422).json({ errors: errors.mapped() })
    //k nen dung array vi lap lai, dung mapped thu se biet
  }
}
