import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  _id?: ObjectId;
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price?: number | null;
}

const imageSchema = new Schema<IImage>(
  {
    fileName: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Поле "title" обязательно'],
      unique: true,
      trim: true,
      minlength: [2, 'Минимальная длина поля "title" - 2'],
      maxlength: [30, 'Максимальная длина поля "title" - 30'],
    },
    image: {
      type: imageSchema,
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Поле "category" обязательно'],
      trim: true,
    },
    description: {
      type: String,
      default: undefined,
      trim: true,
    },
    price: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'product',
  },
);

productSchema.index({ title: 1 }, { unique: true });

export default mongoose.model<IProduct>('product', productSchema);
