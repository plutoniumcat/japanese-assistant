// Use environment variables
require('dotenv').config();

// Import OpenAI from langchain
const { OpenAI } = require("langchain/llms/openai");

// Create LLM instance
const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9});

// Send prompt to LLM
async function sendPrompt(prompt) {
    const result = await llm.call(prompt);
    return result
}

module.exports = { sendPrompt }