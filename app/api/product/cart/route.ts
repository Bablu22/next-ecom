import startDB from "@/app/lib/db";
import CartModel from "@/app/models/CartModel";
import { NewCartRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    const profile = session?.user;
    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        {
          status: 401,
        }
      );
    }
    const { productId, quantity } = (await req.json()) as NewCartRequest;
    if (!isValidObjectId(productId) || isNaN(quantity)) {
      return NextResponse.json(
        { error: "Invalid request" },
        {
          status: 401,
        }
      );
    }

    await startDB();
    const cart = await CartModel.findOne({ userId: profile.id });
    if (!cart) {
      await CartModel.create({
        userId: profile.id,
        items: [{ productId, quantity }],
      });
      return NextResponse.json({ success: true });
    }

    const existinngItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existinngItem) {
      existinngItem.quantity += quantity;
      if (existinngItem.quantity <= 0) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      cart.items.push({ productId: productId as any, quantity });
    }
    await cart.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    throw error;
  }
};
