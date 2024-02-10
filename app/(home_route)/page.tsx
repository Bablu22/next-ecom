import GridView from "../components/Products/GridView";
import ProductCard from "../components/Products/ProductCard";
import startDB from "../lib/db";
import ProductModel from "../models/productModel";

interface LatestProduct {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: {
    base: number;
    discounted: number;
  };
  category: string;
  sale: number;
}

const fetchLatestProducts = async () => {
  await startDB();
  const products = await ProductModel.find().sort("-createdAt").limit(20);

  const productList = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail.url,
      price: product.price,
      category: product.category,
      sale: product.sale,
    };
  });

  return JSON.stringify(productList);
};

export default async function Home() {
  const latestProducts = await fetchLatestProducts();
  const parseProducts = JSON.parse(latestProducts) as LatestProduct[];
  return (
    <GridView>
      {parseProducts.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </GridView>
  );
}
