import Joi from "joi";

export const createOrderSchema = Joi.object({
  body: Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

export const updateOrderSchema = Joi.object({
  body: Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});
