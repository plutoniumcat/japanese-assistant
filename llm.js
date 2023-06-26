// Use environment variables
require('dotenv').config();

// Import prompt templates and chains from langchain
const { PromptTemplate } = require('langchain');
const { LLMChain, SequentialChain } = require('langchain/chains')
// Import OpenAI from langchain
const { OpenAI } = require("langchain/llms/openai");

// Create LLM instance
const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9});

// Create prompt templates
const scheduleEmailTemplate = new PromptTemplate({
    inputVariables: ['dates', 'info'],
    template: `Using Japanese appropriate for business situations, 
    write an email from a job seeker to schedule a job interview at one of the following times: {dates}.
    Include the following information: {info}`
})

const rescheduleEmailTemplate = new PromptTemplate({
    inputVariables: ['dates', 'info'],
    template: `Using Japanese appropriate for business situations, 
    write an email from a job seeker to rechedule a job interview for one of the following times: {dates}.
    Include the following information: {info}`
})

const backTranslateTemplate = new PromptTemplate({
    inputVariables: ['jpText'],
    template: `Translate the following Japanese text into English: {jpText}`
});

// Create LLM chains
const scheduleEmailChain = new LLMChain({
    llm: llm,
    prompt: scheduleEmailTemplate,
    outputKey: ['jpText']
});

const backTranslateChain = new LLMChain({
    llm: llm,
    prompt: backTranslateTemplate,
    outputKey: ['enText']
});

// Create sequential chain
const emailSequentialChain = new SequentialChain({
    chains: [scheduleEmailChain, backTranslateChain],
    inputVariables: ['dates', 'info'],
    outputVariables: ['jpText', 'enText'],
    verbose: true
});

// Send prompt to LLM
async function sendPrompt(prompt) {
    const result = await llm.call(prompt);
    return result
}

// Send schedule email chain to LLM
async function sendScheduleEmail(request) {
    const result = await emailSequentialChain.call({dates: request.body.dates, info: request.body.info});
    return result
}

module.exports = { sendPrompt, sendScheduleEmail }