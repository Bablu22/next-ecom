import { Model, Schema, model, models } from "mongoose";
import categories from "../utils/categories";

export interface NewProduct {
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: { url: string; id: string };
  images?: { url: string; id: string }[];
  price: {
    base: number;
    discounted: number;
  };
  category: string;
  quantity: number;
}

export interface ProductDocument extends NewProduct {
  sale: number;
}

const productSchema = new Schema<ProductDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bulletPoints: [String],
    thumbnail: {
      type: Object,
      required: true,
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    images: [
      {
        url: String,
        id: String,
      },
    ],
    price: {
      base: {
        type: Number,
        required: true,
      },
      discounted: {
        type: Number,
        required: true,
      },
    },

    category: {
      type: String,
      enum: [...categories],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual("sale").get(function () {
  return Math.round(
    ((this.price.base - this.price.discounted) / this.price.base) * 100
  );
});

const ProductModel =
  models.Product || model<ProductDocument>("Product", productSchema);

export default ProductModel as Model<ProductDocument>;
