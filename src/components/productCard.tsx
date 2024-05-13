import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Heading,
  Text,
  Img,
  Flex,
  Center,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import Button from "../components/form-elements/button";
import { BsArrowUpRight } from "react-icons/bs";
import { useRouter } from "next/router";
import QRCode from "qrcode.react";

interface ProductProps {
  productId: number;
  name: string;
  description: string;
  imageURL: string;
  qrCode: string;
}
async function postData(url: string): Promise<any> {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: '{"content":"https://apyhub.com"}',
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export default function ProductCard(props: ProductProps) {
  const router = useRouter();
  const { productId, name, description, imageURL, qrCode } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Center py={6}>
      <Box
        w="xs"
        rounded={"sm"}
        my={5}
        mx={[0, 5]}
        overflow={"hidden"}
        bg="white"
        border={"1px"}
        borderColor="black"
        className="cursor-pointer"
        boxShadow={useColorModeValue("6px 6px 0 black", "6px 6px 0 cyan")}
      >
        <Box
          h={"200px"}
          borderBottom={"1px"}
          borderColor="black"
          onClick={() => {
            router.push(`/history?productId=${productId}`);
          }}
        >
          <Img
            src={imageURL}
            roundedTop={"sm"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </Box>
        <Box
          p={4}
          onClick={() => {
            router.push(`/history?productId=${productId}`);
          }}
          className="cursor-pointer"
        >
          <Box
            bg="black"
            display={"inline-block"}
            px={2}
            py={1}
            color="white"
            mb={2}
          >
            <Text fontSize={"xs"} fontWeight="medium">
              {productId}
            </Text>
          </Box>
          <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
            {name}
          </Heading>
          <Text color={"gray.500"} noOfLines={2}>
            {description}
          </Text>
        </Box>
        <HStack borderTop={"1px"} color="black">
          <Flex
            p={4}
            alignItems="center"
            onClick={() => {
              onOpen();
            }}
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            cursor={"pointer"}
            w="full"
          >
            <Modal onClose={onClose} size={'sm'} isOpen={isOpen} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> Verify authenticity of product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text className="font-semibold text-sm text-gray-700 text-center pb-5 -pt-5">
                    Just scan the QR code and check the provenance.
                  </Text>
                  <div className="flex justify-center">
                    <QRCode value={qrCode} size={300} />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button label="Close" onClick={onClose} />
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              Show QR
            </Text>
            <BsArrowUpRight />
          </Flex>
        </HStack>
      </Box>
    </Center>
  );
}
