import { NextPage } from "next";
import React from "react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Input from "../components/form-elements/input";
import Button from "../components/form-elements/button";
import Header from "../components/header";
import ProductDetail from "../components/productDetail";
import { useDisclosure, useToast } from "@chakra-ui/react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useContractRead,
} from "wagmi";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
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

const UpdateProduct: NextPage = () => {
  const [productData, setProductData] = useState({});
  const [productID, setProductID] = useState(0);
  const [productLocation, setProuctLocation] = useState("");
  const [locationURL, setLocationURL] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const toast = useToast();

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getProduct",
    args: [productID],
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "addLocationStatus",
    args: [productID, productLocation, locationURL],
  });
  const { data: updateData, write } = useContractWrite(config);

  const { isLoading: isLoadingUpdate, isSuccess } = useWaitForTransaction({
    hash: updateData?.hash,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocationURL(
          `https://www.google.com/maps?q=${latitude},${longitude}`
        );
      });
    }
  }, []);

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
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Location Updated",
        description: "Product location updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (userAddress == address) {
      toast({
        title: "Distributor Role Verified",
        description: "Distributor Role has been verified successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      write?.();
    }
  }, [userAddress]);

  return (
    <>
      <Head>
        <title>Update Product</title>
        <meta name="description" content="Chain - Update Product" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 my-8 mx-auto max-w-[1080px]">
        <div className="max-w-7xl pt-5 pb-5 mx-auto">
          <Header heading="Update Product" />
          <div className="flex flex-col lg:flex-row text-center w-full">
            <div className="w-full md:w-1/2">
              <div className="w-full pl-0 p-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center flex md:h-full">
                <div className="relative w-full h-full md:h-auto">
                  <div className="relative bg-white backdrop-blur-sm bg-opacity-20 rounded-lg shadow dark:bg-gray-700 dark:bg-opacity-20">
                    <div className="px-6 py-6 lg:px-8">
                      <form className="space-y-6">
                        <Input
                          id="productid"
                          name="productid"
                          label="Product ID"
                          type="text"
                          placeholder="Product ID"
                          onChange={(e) =>
                            setProductID(parseInt(e.target.value))
                          }
                        />
                        <Input
                          id="Location"
                          name="Location"
                          label="Location"
                          placeholder="Location"
                          onChange={(e) => setProuctLocation(e.target.value)}
                        />
                        <Button
                          label="Update Product"
                          onClick={() => {
                            write?.();
                          }}
                        />
                        <Modal onClose={onClose} isOpen={isOpen} isCentered>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              {" "}
                              Verify your Distributor Role{" "}
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Text className="font-semibold text-sm text-gray-500 text-center pb-5 -pt-5">
                                Please verify with the same wallet address that
                                is connected to this site.
                              </Text>
                            </ModalBody>
                            <ModalFooter>
                              <Button label="Close" onClick={onClose} />
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full pl-0 p-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center flex">
                <div className="relative w-full md:h-auto">
                  <div className="relative rounded-lg shadow-lg backdrop-blur-sm bg-white/30 bg-opacity-30 dark:bg-gray-700/30 dark:bg-opacity-30">
                    <div className="px-6 py-6 lg:px-8">
                      <p className="text-xl font-medium title-font mb-4 text-[#a13bf7]">
                        {(productData as any).name}
                      </p>
                      <div className="p-2 flex flex-col">
                        <ProductDetail
                          label=""
                          value={(productData as any).imageURL}
                          type="image"
                        />{" "}
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

export default UpdateProduct;