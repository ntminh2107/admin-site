import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-southeast-2", // Asia Pacific (Hanoi) RegionID
  endpoint: "https://mos.ap-southeast-2.sufybkt.com", // Asia Pacific (Hanoi) Endpoint
  credentials: {
    accessKeyId: "JjAiNCBz4GMPLTAGu29vll4UHVR9STmLUQJWinvI",
    secretAccessKey: "nBbRiXDeo0R_pXkzeBOpTAxdyhJeCYyMpf6G7v9I",
  },
});

getSignedUrl(s3, new PutObjectCommand({ Bucket: "<Bucket>", Key: "<Key>" }))
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
