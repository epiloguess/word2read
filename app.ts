import express from "express";
import { diskStorage } from "multer";
import multer from "multer";
import { processEpub } from "./src/epub-process.js";
import cors from "cors";

const app = express();
const port = 3001;

// 配置 multer 中间件
const storage = diskStorage({
  destination: (req, file, cb) => {
    // 指定上传文件保存的目录
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const upload = multer({ storage });

app.use(cors(corsOptions));

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("new req...");
  let start = Date.now();
  let result = await processEpub(req.file.path);
  let end = Date.now();
  console.log(`The loop took ${end - start} ms`);
  res.json(result);
});

// let sum = 0;
// for (let index = 0; index < 20; index++) {
//   let start = Date.now();
// await processEpub("./public/book.epub");
//   let end = Date.now();
//   console.log(`The loop took ${end - start} ms`);
//   sum += end - start;
// }
// console.log("average:", sum / 20);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
