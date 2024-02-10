"use client";
import ProductForm from "@/app/components/Admin/ProductForm";
import { INewProduct, ImageUploadResponse } from "@/app/types";
import { uploadImage } from "@/app/utils/helper";
import { productValidationSchema } from "@/app/utils/productValidationSchema";
import { toast } from "react-toastify";
import { ValidationError, string } from "yup";
import { createProduct } from "../action";

const Create = () => {
  const handleCreateProduct = async (values: INewProduct) => {
    const { thumbnail, images } = values;
    try {
      await productValidationSchema.validate(values, {
        abortEarly: false,
      });
      const thumbnailRes = await uploadImage(thumbnail!);

      let productImages: ImageUploadResponse[] = [];
      if (images) {
        const uploadPromise = images.map(async (file) => {
          const { url, id } = await uploadImage(file);
          return { url, id };
        });
        productImages = await Promise.all(uploadPromise);
      }

      await createProduct({
        ...values,
        thumbnail: thumbnailRes,
        images: productImages,
        price: {
          base: values.mrp,
          discounted: values.salePrice,
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          toast.error(err.message);
        });
      }
    }
  };

  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
};

export default Create;
