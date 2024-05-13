import formidable from "formidable";
import fs from "fs";
import PinataClient from "@pinata/sdk";
const pinata = new PinataClient({ pinataJWTKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlOGNkOWJlMi1iNTM1LTQxODMtOTI4MS05ZjYzZGU4NzlkY2UiLCJlbWFpbCI6InJrd2ViMy4wMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTQ4MzUxY2FjYmViOTE0Yjg1YzQiLCJzY29wZWRLZXlTZWNyZXQiOiJiM2E1ODVmYWE0NzI5YTI2ZWM1OTQ1YzYwMTQyNGE5MjljM2FmODQ4YmQ4MTI3MGIxODAwMGI1OTdjYzgxODI4IiwiaWF0IjoxNzExMDQ4OTAxfQ.XrPAs-fL4PXsQz4rud-g5hw-Fn4pWPwR7Xqh4wrlt-c" });

export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadedFile {
  filepath: string;
  originalFilename: string;
}

const saveFile = async (file: UploadedFile) => {
  try {
    const stream = fs.createReadStream(file.filepath);
    const options = {
      pinataMetadata: {
        name: file.originalFilename,
      },
    };
    const response = await pinata.pinFileToIPFS(stream, options);
    fs.unlinkSync(file.filepath);

    return response;
  } catch (error) {
    throw error;
  }
};

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        if (err) {
          console.log({ err });
          return res.send(err);
        }
        const response = await saveFile(files.file as unknown as UploadedFile);
        const { IpfsHash } = response;

        return res.status(200).send({
          hash: IpfsHash,
        });
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const response = await pinata.pinList({
        pageLimit: 1,
        pageOffset: 0,
      });
      res.json(response.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  }
}
