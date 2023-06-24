// Use environment variables
require('dotenv').config();

// Import express and create instance
const express = require('express');
const app = express();

// Import LLM functions
const { sendPrompt } = require('./llm');

// Enable JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Get port from .env
const PORT = process.env.PORT;

// Home route
app.get('/', (request, response) => {
    response.send('hello world');
});

// Submit prompt
app.post('/', async (request, response) => {
    // Get prompt from req and send to OpenAI
    if (request.body.prompt) {
        let llmResponse = await sendPrompt(request.body.prompt)
        response.json({llmResponse: llmResponse})
    } else {
        console.error('No prompt provided');
    }
})

// Activate server
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
});