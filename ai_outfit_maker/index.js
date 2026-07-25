import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = 3000;

// Middleware to allow data passing and connection from your HTML file
app.use(cors());
app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({});

app.post("/api/generate-outfit", async (req, res) => {
  try {
    const { prompt } = req.body; 

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    // This is the correct, updated method and model setup:
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    // Send the clean text response back to the browser
    res.json({ text: response.text });

  } catch (error) {
    console.error("Backend error:", error.message);
    res.status(500).json({ error: "AI failed to respond." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port} 🚀`);
});