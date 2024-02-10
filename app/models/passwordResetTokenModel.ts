import { compare, genSalt, hash } from "bcrypt";
import { Schema, Document, ObjectId, models, model, Model } from "mongoose";

interface IPasswordRestTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface IMethods {
  compareToken(token: string): Promise<boolean>;
}

const PasswordRestTokenSchema = new Schema<
  IPasswordRestTokenDocument,
  {},
  IMethods
>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

PasswordRestTokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) return next();

  const salt = await genSalt(10);
  this.token = await hash(this.token, salt);
});

PasswordRestTokenSchema.methods.compareToken = async function (token) {
  try {
    return await compare(token, this.token);
  } catch (error) {
    throw error;
  }
};

const PasswordRestTokenModel =
  models.PasswordRestToken ||
  model("PasswordRestToken", PasswordRestTokenSchema);

export default PasswordRestTokenModel as Model<
  IPasswordRestTokenDocument,
  {},
  IMethods
>;
