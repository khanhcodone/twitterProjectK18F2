import { NextFunction, RequestHandler, Response, Request } from 'express'

export const wrapAsync = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
      //bản thân async là ham promise nenn can có await để đợi hứng cái đó
    } catch (error) {
      next(error)
    }
  }
}
