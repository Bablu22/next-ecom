import ProductTable, { Product } from "@/app/components/Admin/ProductTable";
import startDB from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { redirect } from "next/navigation";

const fetchProducts = async (
  pageNo: number,
  perPage: number
): Promise<Product[]> => {
  await startDB();
  const skipCount = (pageNo - 1) * perPage;
  const products = await ProductModel.find()
    .sort("-createdAt")
    .skip(skipCount)
    .limit(perPage);

  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail.url,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        saleOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });
};

const PRODUCTPER_PAGE = 10;

interface Props {
  searchParams: { page: string };
}

const Products = async ({ searchParams }: Props) => {
  const { page = "1" } = searchParams;
  if (isNaN(+page)) return redirect("/404");
  const products = await fetchProducts(+page, PRODUCTPER_PAGE);
  let hasMore = true;
  if (products.length < PRODUCTPER_PAGE) hasMore = false;
  else hasMore = true;

  return (
    <div>
      <ProductTable
        products={products}
        currentPageNo={+page}
        hasMore={hasMore}
      />
    </div>
  );
};

export default Products;
