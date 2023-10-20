import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
// can be reused by many routes
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'

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

    res.status(400).json({ errors: errors.mapped() })
    //k nen dung array vi lap lai, dung mapped thu se biet
  }
}
