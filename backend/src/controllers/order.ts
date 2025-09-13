import mongoose, { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/product';

import BadRequestError from '../errors/bad-request-error';

const postOrder = (req: Request, res: Response, next: NextFunction) => {
  const { total, items } = req.body;
  const productIds = items.map((id: string) => new Types.ObjectId(id));

  Product.find({
    _id: { $in: productIds },
  })
    .then((products) => {
      const missingProducts = items.filter(
        (id: string) => !products.some((product: IProduct) => product._id!.toString() === id),
      );

      if (missingProducts.length > 0) {
        return Promise.reject(
          new BadRequestError(
            `Товар(ы) с id ${missingProducts.join(', ')} не найден`,
          ),
        );
      }

      const unbuyingProducts = items.filter(
        (id: string) => !products.some(
          (product: any) => product._id.toString() === id && product.price !== null,
        ),
      );

      if (unbuyingProducts.length > 0) {
        return Promise.reject(
          new BadRequestError(
            `Товар(ы) с id ${unbuyingProducts.join(', ')} отсутствуют в продаже`,
          ),
        );
      }

      const calculatedTotal = products.reduce(
        (sum: number, product: IProduct) => sum + product.price!,
        0,
      );
      if (calculatedTotal !== total) {
        return Promise.reject(new BadRequestError('Указана неверная сумма заказа'));
      }

      return res.send({ id: faker.string.uuid(), total });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'));
      }
      return next(error);
    });
};

export default postOrder;
