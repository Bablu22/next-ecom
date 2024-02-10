import categories from "@/app/utils/categories";
import * as yup from "yup";

const fileValidator = (file: File | undefined): boolean => {
  if (!file) return false;
  const maxSize = 1048576; // 1MB in bytes
  const allowedTypes = ["image/jpeg", "image/png"];

  return file.size <= maxSize && allowedTypes.includes(file.type);
};

const commonSchema = {
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  bulletPoints: yup.array().of(yup.string()),
  mrp: yup.number().required("MRP is required"),
  salePrice: yup
    .number()
    .required()
    .lessThan(yup.ref("mrp"), "Sale price must be less than MRP"),
  category: yup.string().required().oneOf(categories, "Invalid vategory"),
  quantity: yup.number().required().integer(),
  images: yup.array().of(
    yup
      .mixed()
      .test("fileSize", "Images must be less than 1MB", (file) =>
        fileValidator(file as File)
      )
      .test("fileType", "Images must be images", (file) =>
        fileValidator(file as File)
      )
  ),
};

export const productValidationSchema = yup.object().shape({
  ...commonSchema,
  thumbnail: yup
    .mixed()
    .required("Thumbnail is required")
    .test("fileSize", "Thumbnail must be less than 1MB", (file) =>
      fileValidator(file as File)
    )
    .test("fileType", "Thumbnail must be an image", (file) =>
      fileValidator(file as File)
    ),
});
export const updatProductValidationSchema = yup.object().shape({
  ...commonSchema,
});
