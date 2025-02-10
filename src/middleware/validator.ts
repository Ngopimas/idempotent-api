import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateRequest = (schema: Joi.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateOrder = validateRequest(
  Joi.object({
    body: Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
    }),
  })
);
