const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config(); // <-- make sure this is near the top

const app = express();
app.use(cors());
app.use(express.json());

// ✅ This is the correct way to use OpenAI in CommonJS
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  const feedback = req.body.feedback;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You're an AI assistant that analyzes feedback and returns sentiment, urgency, themes, and keywords as JSON.",
        },
        {
          role: "user",
          content: `Analyze the following feedback and return this as JSON:\n{
            sentiment: 'Positive/Neutral/Negative',
            urgency: 'Low/Medium/High',
            themes: ['Theme1', 'Theme2'],
            keywords: ['word1', 'word2']
          }\nFeedback: ${feedback}`,
        },
      ],
    });

    const output = completion.choices[0].message.content;
    res.json(JSON.parse(output));
  } catch (error) {
    console.error("Error from OpenAI:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI API call failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
