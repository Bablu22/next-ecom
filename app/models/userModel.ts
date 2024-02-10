import { Document, Model, Schema, model, models } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

interface IUserDocument extends Document {
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
  avatar?: { url: string; id: string };
  verified: boolean;
}

interface IMethods {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument, {}, IMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: Object,
      url: String,
      id: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const UserModel = models.User || model("User", userSchema);

export default UserModel as Model<IUserDocument, {}, IMethods>;
