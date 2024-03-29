import ProductView from "@/app/components/Products/ProductView";
import startDB from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: {
    product: string;
  };
}

const fetchProduct = async (productId: string) => {
  if (!isValidObjectId(productId)) return redirect("/404");
  await startDB();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  return JSON.stringify({
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail,
    images: product.images?.map(({ url }) => url),
    price: product.price,
    category: product.category,
    quantity: product.quantity,
    bulletPoints: product.bulletPoints,
    sale: product.sale,
  });
};

const page = async ({ params }: Props) => {
  const { product } = params;
  const productId = product[1];
  const productInfo = JSON.parse(await fetchProduct(productId));
  let productImages = [productInfo.thumbnail];
  if (productInfo.images) {
    productImages = productImages.concat(productInfo.images);
  }
  return (
    <ProductView
      title={productInfo.title}
      description={productInfo.description}
      price={productInfo.price}
      sale={productInfo.sale}
      points={productInfo.bulletPoints}
      images={productImages}
    />
  );
};

export default page;
