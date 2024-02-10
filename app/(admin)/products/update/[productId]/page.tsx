import UpdateProduct from "@/app/components/Admin/UpdateProduct";
import startDB from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { ProductResponse } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";

interface Props {
  params: {
    productId: string;
  };
}

const fetchProduct = async (productId: string): Promise<string> => {
  if (!isValidObjectId(productId)) return redirect("/404");
  await startDB();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  const finalProduct: ProductResponse = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail,
    images: product.images?.map(({ url, id }) => ({ url, id })),
    price: product.price,
    category: product.category,
    quantity: product.quantity,
    bulletPoints: product.bulletPoints,
  };
  return JSON.stringify(finalProduct);
};

const Update = async (props: Props) => {
  const { productId } = props.params;
  const product = await fetchProduct(productId);
  return <UpdateProduct product={JSON.parse(product)} />;
};

export default Update;
