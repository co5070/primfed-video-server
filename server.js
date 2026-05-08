const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
res.send("Server running");
});

app.post("/upload", upload.single("video"), (req, res) => {

if (!req.file) {
return res.status(400).json({ error: "No file" });
}

const input = req.file.path;
const outputName = `video-${Date.now()}.mp4`;
const outputPath = `uploads/${outputName}`;

const cmd =
`ffmpeg -i ${input} -vcodec libx264 -crf 28 -preset fast ${outputPath}`;

exec(cmd, (err) => {

if (err) {
return res.status(500).json({ error: "compression failed" });
}

fs.unlinkSync(input);

const url =
`https://YOUR-RAILWAY-URL/${outputName}`;

fs.renameSync(outputPath, `public/${outputName}`);

res.json({
videoUrl: url
});

});

});

app.use(express.static("public"));

app.listen(process.env.PORT || 3000);
