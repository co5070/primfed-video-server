const express =
require("express");

const multer =
require("multer");

const ffmpeg =
require("fluent-ffmpeg");

const cors =
require("cors");

const fs =
require("fs");

const app =
express();

app.use(cors());

const upload =
multer({
dest:"uploads/"
});

app.post(
"/compress",
upload.single("video"),
(req,res)=>{

const input =
req.file.path;

const output =
`compressed-${Date.now()}.mp4`;

ffmpeg(input)

.videoCodec("libx264")

.size("720x?")

.outputOptions([
"-crf 32",
"-preset veryfast"
])

.save(output)

.on("end",()=>{

res.download(
output,
()=>{

fs.unlinkSync(input);

fs.unlinkSync(output);

}
);

});

}
);

app.listen(
3000,
()=>{

console.log(
"Server running"
);

}
);
