const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());

/* STORAGE */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* UPLOAD */
app.post("/upload", upload.single("video"), (req, res) => {

  const inputPath = req.file.path;

  const outputPath =
    "compressed/" +
    Date.now() +
    ".mp4";

  ffmpeg(inputPath)

    .outputOptions([
      "-vcodec libx264",
      "-crf 28",
      "-preset fast"
    ])

    .save(outputPath)

    .on("end", () => {

      fs.unlinkSync(inputPath);

      const videoUrl =
        req.protocol +
        "://" +
        req.get("host") +
        "/" +
        outputPath;

      res.json({
        success: true,
        videoUrl
      });

    })

    .on("error", (err) => {

      console.log(err);

      res.status(500).json({
        success: false
      });

    });

});

app.use(
  "/compressed",
  express.static("compressed")
);

app.listen(3000, () => {
  console.log("Server running");
});
