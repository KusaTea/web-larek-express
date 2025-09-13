import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import errorHandler from './middlewares/error-handler';

const app = express();
const PORT: string = process.env.PORT || '3000';

const dbAddress: string = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
mongoose.connect(dbAddress);

const cors = require('cors');

app.use(cors());

app.use(requestLogger);

app.use(express.json());

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен, порт ${PORT}`);
});
