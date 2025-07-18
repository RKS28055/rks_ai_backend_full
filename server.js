import express from "express";
import multer from "multer";
import cors from "cors";
import { transcribeAudio } from "./utils/whisper.js";
import { chatWithGPT } from "./utils/gpt.js";
import { textToSpeech } from "./utils/tts.js";

const app = express();
const upload = multer();
app.use(cors());

app.post("/voice", upload.single("audio"), async (req, res) => {
  try {
    const audioBuffer = req.file.buffer;
    const text = await transcribeAudio(audioBuffer);
    const reply = await chatWithGPT(text);
    const audio = await textToSpeech(reply);
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing voice input.");
  }
});

app.listen(10000, () => {
  console.log("🚀 RKS server ready on port 10000");
});