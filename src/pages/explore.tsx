import Head from "next/head";
import ProductCard from "../components/productCard";
import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import { contractAddress } from "@/utils/constant";
import { contractABI } from "@/utils/contractABI";


export default function Products() {
  interface ProductDetails {
    productId: number;
    name: string;
    description: string;
    imageURL: string;
    locationStatuses: string[];
    timestamp: number[];
    locationURL: string[];
    qrCode: string;
  }

  const [productData, setProductData] = useState([{}]);

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getAllProducts",
  });

  async function postData(id: string): Promise<any> {
    try {
      const response = await fetch("api/test", {
        method: "POST",
        body: '{"content":"https://apyhub.com"}',
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if ((data as ProductDetails[]) && !isLoading) {
      let products = [];
      for (let product of data as ProductDetails[]) {
        const productId =product.productId.toString();
        const data = postData(String(productId));
        products.push({
          productId: product.productId.toString(),
          name: product.name,
          description: product.description,
          imageURL: product.imageURL,
          qrCode: `https://route-eth.vercel.app/history?productId=${productId}`,
        });
      }
      setProductData(products);
    }
  }, [data, isLoading]);

  useEffect(() => {
    console.log(productData);
  }, [productData]);

  return (
    <>
      <Head>
        <title>Explore</title>
        <meta name="description" content="Explore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 3 }}
        spacing={"20"}
        maxW={"container.xl"}
        my={16}
        mx={"auto"}
      >
        {productData.map((products: any, index: number) => (
          <ProductCard {...products} index={index} key={index} />
        ))}
      </SimpleGrid>
    </>
  );
}
