import express from "express";
import multer from "multer";
import { processEpub } from "./src/epub-process.js";
// import { processEpub } from "./src/epub-process1.js";
import cors from "cors";

const app = express();
const port = 3000;

// 配置 multer 中间件
const storage = multer.diskStorage({
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
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const upload = multer({ storage });

app.use(cors(corsOptions));

app.post("/upload", upload.single("file"), async (req, res) => {
  let start = Date.now();
  let result = await processEpub(req.file.path);
  let end = Date.now(); // 完成
  console.log(`The loop took ${end - start} ms`);
  res.json(result);
});

let sum = 0;
for (let index = 0; index < 20; index++) {
  let start = Date.now();
  await processEpub("./book1.epub");
  let end = Date.now(); // 完成
  console.log(`The loop took ${end - start} ms`);
  sum += end - start;
}
console.log("average:", sum / 20);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
