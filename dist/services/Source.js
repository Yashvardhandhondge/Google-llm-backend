"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullDataAnalysis = exports.summarizeWorkspace = exports.respondToConversation = exports.uploadFiles = void 0;
exports.getContentThroughUrl = getContentThroughUrl;
exports.summarizePDFFile = summarizePDFFile;
exports.summarizeContent = summarizeContent;
exports.suggetionChat = suggetionChat;
exports.extractTextFromFile = extractTextFromFile;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const dotenv_1 = __importDefault(require("dotenv"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const uuid_1 = require("uuid");
const storage_1 = require("firebase/storage");
const firebase_1 = require("../config/firebase");
const markdown_it_1 = __importDefault(require("markdown-it"));
const md = new markdown_it_1.default();
dotenv_1.default.config();
function getContentThroughUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: html } = yield axios_1.default.get(url);
            const $ = cheerio.load(html);
            const bodyText = $("body").text().trim();
            return bodyText ? bodyText.substring(0, 3000) : "No content found.";
        }
        catch (error) {
            console.error("Error fetching content:", error.message);
            return "Failed to fetch content.";
        }
    });
}
function summarizePDFFile(file, openAIApiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!file) {
            throw new Error("Invalid file path provided");
        }
        // Step 1: Read the file as binary data
        const base64PDF = file.buffer.toString("base64");
        // Step 2: Send the file content to OpenAI for summarization
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4-32k", // Use GPT-4 with higher token limits
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant that summarizes PDF documents. The user will provide a base64-encoded PDF, and you should extract key points and summarize them in an informative manner.",
                },
                {
                    role: "user",
                    content: `Here is the PDF file (base64 encoded). Please summarize its content:\n\n${base64PDF}`,
                },
            ],
            max_tokens: 8000, // Adjust based on the model and expected output
        }, {
            headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
            },
        });
        // Step 3: Process the response
        const messageContent = (_c = (_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!messageContent) {
            throw new Error("No content received in the response");
        }
        return messageContent;
    });
}
function summarizeContent(content, openAIApiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an AI trained to summarize text content in a concise and informative manner.",
                },
                {
                    role: "user",
                    content: `Please summarize the following content in atmost 1000 words:\n\n${content}`,
                },
            ],
            max_tokens: 3000,
        }, {
            headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
            },
        });
        const messageContent = (_c = (_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!messageContent) {
            throw new Error("No content received in the response");
        }
        return messageContent;
    });
}
function suggetionChat(content, openAIApiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an AI trained to summarize text content in a concise and informative manner.",
                },
                {
                    role: "user",
                    content: `${content}`,
                },
            ],
            max_tokens: 3000,
        }, {
            headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
            },
        });
        const messageContent = (_c = (_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!messageContent) {
            throw new Error("No content received in the response");
        }
        return messageContent;
    });
}
const uploadFiles = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const metadata = {
        contentType: file.mimetype,
    };
    const userId = (0, uuid_1.v4)();
    const storageRef = (0, storage_1.ref)(firebase_1.storage, `files/${userId}`);
    const uploadResult = yield (0, storage_1.uploadBytes)(storageRef, file.buffer, metadata);
    const fileUrl = yield (0, storage_1.getDownloadURL)(uploadResult.ref);
    return fileUrl;
});
exports.uploadFiles = uploadFiles;
function extractTextFromFile(file, openAIApiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, pdf_parse_1.default)(file.buffer);
            return data.text;
        }
        catch (error) {
            console.error("Error extracting text from PDF:", error);
            throw error;
        }
    });
}
const respondToConversation = (_a) => __awaiter(void 0, [_a], void 0, function* ({ context, question, openAIApiKey }) {
    var _b, _c, _d, _e;
    try {
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: context,
                },
                {
                    role: "user",
                    content: `Please provide an answer to this question: "${question}" from the given content. If the context is not there then please provide answer from your side`,
                },
            ],
            max_tokens: 3000,
        }, {
            headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
            },
        });
        const messageContent = (_d = (_c = (_b = response.data.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
        if (!messageContent) {
            throw new Error("No content received in the response");
        }
        return messageContent;
    }
    catch (error) {
        console.error(((_e = error.response) === null || _e === void 0 ? void 0 : _e.data) || error.message);
        throw new Error("Failed to retrieve the response from ChatGPT");
    }
});
exports.respondToConversation = respondToConversation;
const summarizeWorkspace = (_a) => __awaiter(void 0, [_a], void 0, function* ({ notes, sources, workspaceName, generateReportText, openAIApiKey }) {
    var _b, _c, _d, _e;
    try {
        const prompt = `
            Please provide a detailed report and key insights for the following workspace:
            Workspace Name: ${workspaceName}
            Notes: ${notes.join("\n\n")}
            Sources: ${sources.join("\n\n")} in ${generateReportText}.
            Please provide in points, first for all the notes and then for all the sources.
            And if any data is present which can be used to create any graph please make that.
        `;
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant. Summarize and provide insights based on the provided data.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 3000,
        }, {
            headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
            },
        });
        const summaryContent = (_d = (_c = (_b = response.data.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
        if (!summaryContent) {
            throw new Error("No summary content received in the response");
        }
        return summaryContent;
    }
    catch (error) {
        console.error(((_e = error.response) === null || _e === void 0 ? void 0 : _e.data) || error.message);
        throw new Error("Failed to retrieve summary from OpenAI");
    }
});
exports.summarizeWorkspace = summarizeWorkspace;
const pullDataAnalysis = (context, openAIApiKey) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: JSON.stringify(context),
                },
                {
                    role: "user",
                    content: `This is the data provided by google analytics please check there is headings which the metadataHeader of the data is provided. Please analyze the data which is in the metrics rows metricvalue and give the analysis.`,
                },
            ],
            max_tokens: 3000,
        }, {
            headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
            },
        });
        const messageContent = (_c = (_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!messageContent) {
            throw new Error("No content received in the response");
        }
        return messageContent;
    }
    catch (error) {
        console.error(((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        throw new Error("Failed to retrieve the response from ChatGPT");
    }
});
exports.pullDataAnalysis = pullDataAnalysis;
