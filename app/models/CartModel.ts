import { ObjectId, Schema, Document, model, models, Model } from "mongoose";

interface CartItem {
  productId: ObjectId;
  quantity: number;
}

interface CartDocument extends Document {
  userId: ObjectId;
  items: CartItem[];
}

const cartItemSchema = new Schema<CartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema<CartDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

const CartModel = models.Cart || model<CartDocument>("Cart", cartSchema);

export default CartModel as Model<CartDocument>;
