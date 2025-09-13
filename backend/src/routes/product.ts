import { Router } from 'express';
import { productValidation } from '../middlewares/validations';
import { postProduct, getProducts } from '../controllers/products';

const router = Router();

router.get('/', getProducts);
router.post('/', productValidation, postProduct);

export default router;
