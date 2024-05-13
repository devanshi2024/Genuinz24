import { NextPage } from "next";
import { useState, useEffect } from "react";
import React from "react";
import Head from "next/head";
import Input from "../components/form-elements/input";
import Button from "../components/form-elements/button";
import FileUpload from "../components/form-elements/upload";
import Header from "../components/header";
import {
  useContractEvent,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
// @ts-ignore
import { Web3Storage } from "web3.storage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { contractAddress } from "@/utils/constant";
import { contractABI } from "@/utils/contractABI";
import Upload from "../components/form-elements/upload";

const Addproduct: NextPage = () => {
  const [productData, setProductData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState("");
  const { address, isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userAddress, setUserAddress] = useState("");
  const [productImage, setProductImage] = useState("");

  const toast = useToast();
  const handleData = (e: any) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "addProduct",
    args: [
      (productData as any).productid,
      (productData as any).productname,
      (productData as any).description,
      (productData as any).Location,
      imageUrl,
      (productData as any).locationURL,
    ],
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const uploadProductImage = async (file: any) => {
    const image = URL.createObjectURL(file);
    setProductImage(image);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const cid = await res.json();
      setImageUrl(`https://gateway.pinata.cloud/ipfs/${cid.hash}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setProductData({
          locationURL: `https://www.google.com/maps?q=${latitude},${longitude}`,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (userAddress == address) {
      toast({
        title: "Manufacturer Role Verified",
        description: "Manufacturer Role has been verified successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      write?.();
      setUserAddress("");
    }
  }, [userAddress, address, onClose, write]);

  return (
    <>
      <Head>
        <title>Add Product</title>
        <meta name="description" content="Route - Add Product" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 md:px-0 my-8 mx-auto max-w-[1080px]">
        <div className="max-w-7xl pt-5 pb-5 mx-auto">
          <Header heading="Add Product" />
          <div className="flex flex-col text-center w-full">
            <div className="w-full py-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center flex md:h-full">
              <div className="relative w-full h-full md:h-auto">
                <div className="relative bg-white backdrop-blur-sm bg-opacity-20 rounded-lg shadow dark:bg-gray-700 dark:bg-opacity-20">
                  <div className="px-6 py-6 lg:px-8">
                    <form className="space-y-6">
                      <div className="flex flex-col md:flex-row md:space-x-5">
                        <div className="w-full md:w-1/2 space-y-6 mb-7 md-mb-0">
                          <Input
                            id="productid"
                            name="productid"
                            label="Product ID"
                            type="text"
                            placeholder="Product ID"
                            onChange={handleData}
                          />
                          <Input
                            id="productname"
                            name="productname"
                            label="Product Name"
                            placeholder="Product Name"
                            onChange={handleData}
                          />
                          <Input
                            id="description"
                            name="description"
                            label="Description"
                            placeholder="Description"
                            onChange={handleData}
                          />
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                          <Input
                            id="Location"
                            name="Location"
                            label="Location"
                            placeholder="Location"
                            onChange={handleData}
                          />
                          <div className="flex flex-col items-center justify-center gap-5 mb-5">
                            <Image
                              className="mx-auto bg-amber-500 rounded-lg object-fill"
                              src={productImage !== '' ? productImage : '/preview.png'}
                              alt="preview"
                              width={200}
                              height={200}
                            />
                            <Upload
                              id="image"
                              name="image"
                              type="file"
                              label="Upload Product"
                              onChange={(e) => {
                                uploadProductImage(e.target.files[0]);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="max-w-[200px] flex m-auto">
                        <Button
                          label="Add Product"
                          onClick={() => {
                            console.log("productData", (productData as any).Location);
                            write?.();
                          }}
                        />
                        <Modal onClose={onClose} isOpen={isOpen} isCentered>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              {" "}
                              Verify your Manufacturer Role
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
                      </div>
                    </form>
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

export default Addproduct;