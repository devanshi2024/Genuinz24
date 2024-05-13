import React from "react";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Input from "../components/form-elements/input";
import Header from "../components/header";
import Timeline from "../components/timeline";
import ProductDetail from "../components/productDetail";
import { useContractRead } from "wagmi";
import { useRouter } from "next/router";
import { contractAddress } from "@/utils/constant";
import { contractABI } from "@/utils/contractABI";

interface ProductDetails {
  name: string;
  description: string;
  imageURL: string;
  locationStatuses: string[];
  timestamp: number[];
  locationURL: string[];
}

const History: NextPage = () => {
  const [productData, setProductData] = useState({});
  const [productHistory, setProductHistory] = useState([
    { title: "City", time: "dd/mm/yyyy, hh:mm:ss", Location: "" },
  ]);
  const handleData = (e: any) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getProduct",
    args: [parseInt((productData as any).productid)],
  });

  useEffect(() => {
    if ((data as ProductDetails) && !isLoading) {
      const {
        name,
        description,
        imageURL,
        locationStatuses,
        timestamp,
        locationURL,
      } = data as ProductDetails;
      setProductHistory(
        locationStatuses.map((location: string, index: number) => {
          const convertedTime = BigInt(timestamp[index]);
          console.log("convertedTime", convertedTime);
          console.log("location", locationURL);
          // convert unix timestamp to date local string
          const date = new Date(Number(convertedTime) * 1000).toLocaleString();
          return { title: location, time: date, Location: locationURL[index] };
        })
      );

      setProductData({
        ...productData,
        name,
        description,
        imageURL,
        locationStatuses,
        timestamp,
        locationURL,
      });
    }
  }, [data, isLoading]);

  const router = useRouter();
  const productId = router.query.productId as string;

  useEffect(() => {
    if (productId) {
      setProductData({ ...productData, productid: productId });
    }
  }, [productId]);

  return (
    <>
      <Head>
        <title>Product History</title>
        <meta name="description" content="Product History" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 md:px-0 my-8 mx-auto max-w-[1080px]">
        <div className="max-w-7xl pt-5 pb-5 mx-auto">
          <Header heading="Product History" />
          <div className="flex flex-col text-center w-full">
            <div className="w-full py-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center flex md:h-full">
              <div className="relative w-full h-full md:h-auto">
                <div className="relative bg-white bg-opacity-20 backdrop-blur-sm rounded-lg dark:bg-gray-700 dark:bg-opacity-20">
                  <div className="px-6 py-6 lg:px-8">
                    <div className="flex flex-col md:flex-row space-x-5">
                      <div className="w-full md:w-1/2 space-y-6">
                        <form className="space-y-6">
                          <Input
                            id="productid"
                            name="productid"
                            label="Product ID"
                            type="text"
                            placeholder="Product ID"
                            value={(productData as any).productid}
                            onChange={handleData}
                          />
                        </form>
                        <div>
                          <p className="text-xl font-medium title-font mb-4 text-[#a13bf7]">
                            {(productData as any).name}
                          </p>
                          <div className="p-2 flex flex-col">
                            <ProductDetail
                              label=""
                              value={(productData as any).imageURL}
                              type="image"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 space-y-6">
                        <Timeline points={productHistory} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default History;