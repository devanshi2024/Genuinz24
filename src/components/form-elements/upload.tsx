import React from "react";
import { FormLabel, Icon, InputGroup, Button } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";

interface UploadProps {
  id: string;
  name: string;
  label?: string;
  type?: string;
  accept?: string;
  onChange: (e: any) => void;
}

const Upload = ({
  id,
  name,
  label,
  type,
  accept,
  onChange,
}: UploadProps) => {
  return (
    <div className="flex flex-col">
      <FormLabel htmlFor={id} className="text-gray-700 dark:text-white">
        {label}
      </FormLabel>
      <Button
        leftIcon={<Icon as={FiFile} />}
        className="max-w-[300px] text-[#8b00ff] border-2 border-[#8b00ff] mb-5 md:mb-0"
      >
        Upload
        <input
          id={id}
          name={name}
          type={type}
          className="opacity-0 absolute left-0 max-w-[110px]"
          accept={accept}
          onChange={onChange}
        />
      </Button>
    </div>
  );
};

export default Upload;

Upload.defaultProps = {
  label: "",
  placeholder: "",
  type: "file",
  accept: "image/*",
  onchange: () => {},
};