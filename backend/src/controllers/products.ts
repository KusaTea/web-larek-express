import { NextFunction, Request, Response } from 'express';
import { Error as MangooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({})
    .then((products) => Product.countDocuments()
      .then((total) => {
        res.send({ items: products, total });
      }))
    .catch((error) => next(error));
};

export const postProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;

  Product.create({
    title,
    image,
    category,
    description,
    price,
  })
    .then((product) => {
      res.status(201).send(product);
    })
    .catch((error) => {
      if (error instanceof MangooseError.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'));
      }
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(
          new ConflictError('Товар с таким названием уже существует'),
        );
      }
      return next(error);
    });
};
