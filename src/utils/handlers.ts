import { NextFunction, RequestHandler, Response, Request } from 'express'

export const wrapAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
      //bản thân async là ham promise nenn can có await để đợi hứng cái đó
    } catch (error) {
      next(error)
    }
  }
}
