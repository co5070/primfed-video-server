const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// CREATE folders if they don’t exist
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("compressed")) fs.mkdirSync("compressed");

app.post("/upload", upload.single("video"), (req, res) => {
  const input = req.file.path;
  const output = `compressed/${Date.now()}.mp4`;

  exec(`ffmpeg -i ${input} -vcodec libx264 -crf 28 ${output}`, (err) => {
    if (err) return res.status(500).send("Compression failed");

    fs.unlinkSync(input);

    res.json({
      url: `https://YOUR-RAILWAY-URL/${output}`
    });
  });
});

app.use("/compressed", express.static("compressed"));

app.listen(3000, () => console.log("Server running"));
