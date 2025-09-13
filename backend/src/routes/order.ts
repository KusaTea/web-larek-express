import { Router } from 'express';
import { orderValidation } from '../middlewares/validations';
import postOrder from '../controllers/order';

const router = Router();

router.post('/', orderValidation, postOrder);

export default router;
