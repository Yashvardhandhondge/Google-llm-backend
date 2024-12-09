"use strict";
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
exports.renameWorkspace = exports.removeSource = exports.renameSource = exports.deleteNote = exports.generateReport = exports.getGaReportForWorkspace = exports.getGaReport = exports.getGaProperties = exports.getAllAccounts = exports.googleAnalytics = exports.updateNote = exports.createConversationOfSuggestion = exports.createConversation = exports.getAllSources = exports.createSource = exports.getAllNotes = exports.createNewNote = exports.getWorkspace = exports.getAllWorkspaces = exports.createNewWorkspace = exports.getOpenAikey = exports.saveOpenAikey = exports.getUser = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Workspace_1 = __importDefault(require("../models/Workspace"));
const Note_1 = __importDefault(require("../models/Note"));
const Source_1 = require("../services/Source");
const Source_2 = __importDefault(require("../models/Source"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, clerkId } = req.body;
    try {
        const newUser = new User_1.default({
            clerkId,
            email,
        });
        yield newUser.save();
        res.status(201).json({ newUser, message: "Successfully Signed In" });
    }
    catch (error) {
        res.status(500).json({ message: "Error saving user data" });
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkId } = req.params;
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user, message: "Logged in succssfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
});
exports.getUser = getUser;
const saveOpenAikey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkId } = req.params;
    const { api_key } = req.body;
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.openAikey = api_key;
        yield user.save();
        res.status(200).json({
            message: "API saved successfully",
            api: user.openAikey === "" ? false : true,
            googleAnalytics: user.googleAnalytics === "" ? false : true,
            propertyId: user.propertyId === '' ? false : true
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
});
exports.saveOpenAikey = saveOpenAikey;
const getOpenAikey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkId } = req.params;
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "API saved successfully",
            api: user.openAikey === "" ? false : true,
            googleAnalytics: user.googleAnalytics === "" ? false : true,
            propertyId: user.propertyId === "" ? false : true,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
});
exports.getOpenAikey = getOpenAikey;
const createNewWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceName } = req.body;
    const { clerkId } = req.params;
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newWorkspace = new Workspace_1.default({
            name: workspaceName,
        });
        yield newWorkspace.save();
        user.workspaces.push(newWorkspace._id);
        yield user.save();
        res.status(201).json({
            message: "Workspace created successfully",
            workspace: newWorkspace,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error while creating workspace" });
    }
});
exports.createNewWorkspace = createNewWorkspace;
const getAllWorkspaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkId } = req.params;
    try {
        const user = yield User_1.default.findOne({ clerkId })
            .populate({
            path: "workspaces",
            select: "-notes, -source",
        })
            .lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            workspaces: user.workspaces,
            message: "Workspace Fetched",
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error while fetching workspaces" });
    }
});
exports.getAllWorkspaces = getAllWorkspaces;
const getWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    try {
        const workspace = yield Workspace_1.default.findOne({ _id: workspaceId });
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.status(200).json({ workspace });
    }
    catch (err) {
        res.status(500).json({ message: "Error while fetching workspaces" });
    }
});
exports.getWorkspace = getWorkspace;
const createNewNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    const { heading, content, type } = req.body;
    try {
        const workspace = yield Workspace_1.default.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        const newNote = new Note_1.default({
            heading,
            content,
            type,
        });
        const savedNote = yield newNote.save();
        workspace.notes.push(savedNote._id);
        yield workspace.save();
        res.status(201).json({
            savedNote,
            message: "Note created successfully",
        });
    }
    catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createNewNote = createNewNote;
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    try {
        const workspace = yield Workspace_1.default.findOne({
            _id: workspaceId,
        }).populate("notes");
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.status(200).json(workspace.notes);
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllNotes = getAllNotes;
const createSource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { workspaceId } = req.params;
    const { url, uploadType, clerkId } = req.body;
    const file = (_a = req.file) !== null && _a !== void 0 ? _a : null;
    try {
        const workspace = yield Workspace_1.default.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.json({ message: "User not found" });
        }
        if (user.openAikey === "") {
            return res.status(410).json({ message: "Please provide woking OpenAi key" });
        }
        if (uploadType === "file" && req.file) {
            const fileUrl = yield (0, Source_1.uploadFiles)(file);
            const content = yield (0, Source_1.extractTextFromFile)(file, user.openAikey);
            const summary = yield (0, Source_1.summarizeContent)(content, user.openAikey);
            const newSource = new Source_2.default({
                url: fileUrl,
                summary,
                name: req.file.originalname,
                uploadType,
            });
            yield newSource.save();
            workspace.sources.push(newSource._id);
            yield workspace.save();
            return res.status(200).json({ newSource, message: "Source Added" });
        }
        else if (uploadType === "url" && url) {
            // If URL is provided, process it as usual
            const content = yield (0, Source_1.getContentThroughUrl)(url);
            const summary = yield (0, Source_1.summarizeContent)(content, user.openAikey);
            const newSource = new Source_2.default({
                url,
                summary,
                name: "URL Source",
                uploadType,
            });
            yield newSource.save();
            workspace.sources.push(newSource._id);
            yield workspace.save();
            return res.status(200).json({ newSource, message: "Source Added" });
        }
        else {
            return res.status(400).json({
                message: "Invalid input. Either a file or URL is required.",
            });
        }
    }
    catch (error) {
        console.error("Error creating source:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createSource = createSource;
const getAllSources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    try {
        const workspace = yield Workspace_1.default.findOne({
            _id: workspaceId,
        }).populate("sources");
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.status(200).json(workspace.sources);
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllSources = getAllSources;
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { context, question, clerkId } = req.body;
    const user = yield User_1.default.findOne({ clerkId });
    if (!user) {
        return res.json({ message: "User not found" });
    }
    if (user.openAikey === "") {
        return res.json({ message: "Please provide woking OpenAi key" });
    }
    if (context === "," || question === "")
        return res.status(404).json({ message: "Please provide some context" });
    try {
        const resp = yield (0, Source_1.respondToConversation)({
            context,
            question,
            openAIApiKey: user.openAikey,
        });
        res.status(200).json({ message: resp });
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createConversation = createConversation;
const createConversationOfSuggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, clerkId } = req.body;
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.json({ message: "User not found" });
        }
        if (user.openAikey === "") {
            return res.json({ message: "Please provide woking OpenAi key" });
        }
        const resp = yield (0, Source_1.suggetionChat)(question, user.openAikey);
        res.status(200).json({ message: resp });
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createConversationOfSuggestion = createConversationOfSuggestion;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { noteId } = req.params;
    const { heading, content } = req.body;
    try {
        const foundNote = yield Note_1.default.findOne({ _id: noteId });
        if (!foundNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        foundNote.heading = heading;
        foundNote.content = content;
        yield foundNote.save();
        res.status(200).json({
            message: "Note updated successfully",
            note: foundNote,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update note", error });
    }
});
exports.updateNote = updateNote;
const googleAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const state = req.query.state;
    if (Array.isArray(state)) {
        return res.status(400).json({
            message: "Invalid state parameter: expected a single value, but got an array.",
        });
    }
    if (typeof state !== "string") {
        return res
            .status(400)
            .json({ message: "Invalid state parameter: expected a string." });
    }
    const parsedState = JSON.parse(decodeURIComponent(state));
    const clerkId = parsedState === null || parsedState === void 0 ? void 0 : parsedState.clerkId;
    if (!clerkId) {
        return res.status(400).json({ message: "Missing Clerk ID." });
    }
    try {
        // Exchange authorization code for access token
        const tokenResponse = yield axios_1.default.post("https://oauth2.googleapis.com/token", {
            code: req.query.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: `${process.env.BACKEND_URL}/api/users/oauth/google-analytics/callback`,
            grant_type: "authorization_code",
        });
        const { access_token, refresh_token } = tokenResponse.data;
        // Find user by clerk ID
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Save tokens in user record
        user.googleAnalytics = access_token;
        user.googleRefreshToken = refresh_token;
        yield user.save();
        const redirectUrl = (parsedState === null || parsedState === void 0 ? void 0 : parsedState.redirectUrl) || `${process.env.API_URL}/home`;
        res.redirect(redirectUrl);
    }
    catch (error) {
        console.error("OAuth Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message || error);
        return res.status(500).json({
            message: "OAuth process failed.",
            details: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) ||
                error.message ||
                "Unknown error occurred",
        });
    }
});
exports.googleAnalytics = googleAnalytics;
const getAllAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const clerkId = req.query.clerkId;
    if (!clerkId) {
        return res.status(400).json({ message: "Clerk ID is required." });
    }
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        oauth2Client.setCredentials({
            access_token: user.googleAnalytics,
            refresh_token: user.googleRefreshToken,
        });
        const analyticsAdmin = googleapis_1.google.analyticsadmin("v1beta");
        const accountsResponse = yield analyticsAdmin.accounts.list({
            auth: oauth2Client,
        });
        const accounts = accountsResponse.data.accounts || [];
        res.json(accounts);
    }
    catch (error) {
        console.error("Error fetching GA4 accounts:", error);
        if (((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === "invalid_grant" ||
            ((_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error_description) === null || _e === void 0 ? void 0 : _e.includes("expired"))) {
            try {
                const user = yield User_1.default.findOne({ clerkId });
                if (!user) {
                    return res.json({ message: "User not found" });
                }
                user.googleAnalytics = "";
                user.propertyId = "";
                user.googleRefreshToken = "";
                yield user.save();
                res.status(410).json({
                    message: "Token expired, Link again Google Analytics..",
                });
            }
            catch (updateError) {
                console.error("Error removing tokens:", updateError);
            }
        }
        res.status(500).json({ message: "Failed to fetch accounts." });
    }
});
exports.getAllAccounts = getAllAccounts;
const getGaProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkId, accountId } = req.query;
    if (!clerkId) {
        return res.status(400).json({ message: "Clerk ID is required." });
    }
    try {
        // Fetch the user from the database
        const user = yield User_1.default.findOne({ clerkId });
        if (!user)
            return res.status(404).json({ message: "User not found." });
        oauth2Client.setCredentials({
            access_token: user.googleAnalytics,
            refresh_token: user.googleRefreshToken,
        });
        // Step 1: Fetch all accessible GA4 properties
        const analyticsAdmin = googleapis_1.google.analyticsadmin("v1beta");
        const propertiesResponse = yield analyticsAdmin.properties.list({
            filter: `parent:${accountId}`,
            auth: oauth2Client,
        });
        const properties = propertiesResponse.data.properties || [];
        if (!properties || properties.length === 0) {
            return res
                .status(404)
                .json({ message: "No GA4 properties found." });
        }
        // Return the list of properties
        res.json({ properties });
    }
    catch (error) {
        console.error("Error fetching GA4 properties:", error);
        // Check if error has specific details
        if (error.response) {
            return res
                .status(error.response.status)
                .json({ message: error.response.data });
        }
        res.status(500).json({ message: "Failed to fetch GA4 properties." });
    }
});
exports.getGaProperties = getGaProperties;
const getGaReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { clerkId, propertyId } = req.query;
    // Validate required parameters
    if (!clerkId || !propertyId) {
        return res
            .status(400)
            .json({ message: "Clerk ID and Property ID are required." });
    }
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.openAikey === '') {
            return res.json({ message: 'Please provide OpenAI key' });
        }
        oauth2Client.setCredentials({
            access_token: user.googleAnalytics,
            refresh_token: user.googleRefreshToken,
        });
        const analyticsData = googleapis_1.google.analyticsdata("v1beta");
        const reportResponse = yield analyticsData.properties.runReport({
            auth: oauth2Client,
            property: propertyId,
            requestBody: {
                dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
                metrics: [
                    { name: "activeUsers" },
                    { name: "screenPageViews" },
                    { name: "eventCount" },
                    { name: "userEngagementDuration" },
                    { name: "sessions" },
                    { name: "newUsers" },
                    { name: "totalUsers" },
                ],
                dimensions: [{ name: "date" }],
                returnPropertyQuota: true,
            },
        });
        const analysis = yield (0, Source_1.pullDataAnalysis)(reportResponse.data, user.openAikey);
        const newNote = new Note_1.default({
            heading: "Google Analytics",
            content: analysis,
            type: "Analytics",
        });
        yield newNote.save();
        let workspaceId;
        if (user.workspaces.length > 0) {
            workspaceId = user.workspaces[0];
            const workspace = yield Workspace_1.default.findOne({ _id: workspaceId });
            workspace === null || workspace === void 0 ? void 0 : workspace.notes.push(newNote._id);
            yield (workspace === null || workspace === void 0 ? void 0 : workspace.save());
        }
        else {
            const newWorkspace = new Workspace_1.default({
                name: "New Workspace",
                notes: [newNote._id],
            });
            yield newWorkspace.save();
            user.workspaces.push(newWorkspace._id);
        }
        user.propertyId = propertyId;
        yield user.save();
        const userWorkspaces = yield User_1.default.findOne({ clerkId })
            .populate({
            path: "workspaces",
            select: "-notes -source",
        })
            .lean();
        res.json({ workspace: userWorkspaces === null || userWorkspaces === void 0 ? void 0 : userWorkspaces.workspaces, propertyId: true });
    }
    catch (error) {
        console.error("Error fetching GA4 analytics report:", error);
        if (((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === "invalid_grant" ||
            ((_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error_description) === null || _e === void 0 ? void 0 : _e.includes("expired"))) {
            try {
                const user = yield User_1.default.findOne({ clerkId });
                if (!user) {
                    return res.json({ message: "User not found" });
                }
                user.googleAnalytics = "";
                user.propertyId = "";
                user.googleRefreshToken = "";
                yield user.save();
                return res.status(410).json({
                    message: "Token expired. Please re-link your Google Analytics account.",
                });
            }
            catch (updateError) {
                console.error("Error removing expired tokens:", updateError);
            }
        }
        res.status(500).json({
            message: "Failed to fetch GA4 analytics report.",
        });
    }
});
exports.getGaReport = getGaReport;
const getGaReportForWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { clerkId, startDate, endDate, metrics } = req.body;
    if (!clerkId ||
        !startDate ||
        !endDate ||
        !metrics ||
        !Array.isArray(metrics)) {
        return res.status(400).json({
            message: "Clerk ID, startDate, endDate, and metrics are required, and metrics must be an array.",
        });
    }
    try {
        const user = yield User_1.default.findOne({ clerkId });
        if (!user)
            return res.status(404).json({ message: "User not found." });
        if (!user.propertyId)
            return res.status(400).json({
                message: "Please select any analytics account from the home page.",
            });
        if (user.openAikey === "") {
            return res.json({ message: "Please provide woking OpenAi key" });
        }
        oauth2Client.setCredentials({
            access_token: user.googleAnalytics,
            refresh_token: user.googleRefreshToken,
        });
        const analyticsData = googleapis_1.google.analyticsdata("v1beta");
        const reportResponse = yield analyticsData.properties.runReport({
            auth: oauth2Client,
            property: user.propertyId,
            requestBody: {
                dateRanges: [{ startDate, endDate }],
                metrics: metrics.map((metric) => ({ name: metric })), // Map metrics to expected format
                dimensions: [{ name: "date" }],
                returnPropertyQuota: true,
            },
        });
        const analysis = yield (0, Source_1.pullDataAnalysis)(reportResponse.data, user.openAikey);
        res.json(analysis);
    }
    catch (error) {
        console.error("Error fetching GA4 analytics report:", error);
        if (((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === "invalid_grant" ||
            ((_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error_description) === null || _e === void 0 ? void 0 : _e.includes("expired"))) {
            try {
                const user = yield User_1.default.findOne({ clerkId });
                if (!user) {
                    return res.json({ message: "User not found" });
                }
                user.googleAnalytics = "";
                user.propertyId = "";
                user.googleRefreshToken = "";
                yield user.save();
                return res.status(410).json({
                    message: "Token expired. Please re-link your Google Analytics account.",
                });
            }
            catch (updateError) {
                console.error("Error removing tokens from database:", updateError);
            }
        }
        res.status(500).json({
            message: "Failed to fetch GA4 analytics report.",
        });
    }
});
exports.getGaReportForWorkspace = getGaReportForWorkspace;
const generateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    const { startDate, endDate, generateReportText, clerkId } = req.body;
    // Validate date inputs
    if (!startDate || !endDate) {
        return res
            .status(400)
            .json({ message: "Start date and end date are required." });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format." });
    }
    if (start > end) {
        return res
            .status(400)
            .json({ message: "Start date cannot be greater than end date." });
    }
    try {
        const workspace = yield Workspace_1.default.findById(workspaceId)
            .populate("notes")
            .populate("sources");
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found." });
        }
        const user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            return res.json({ message: "User not found" });
        }
        if (user.openAikey === "") {
            return res.json({ message: "Please provide woking OpenAi key" });
        }
        const filteredNotes = workspace.notes.filter((note) => {
            const noteDate = new Date(note.createdAt);
            return noteDate >= start && noteDate <= end;
        });
        const filteredSources = workspace.sources.filter((source) => {
            const sourceDate = new Date(source.createdAt);
            return sourceDate >= start && sourceDate <= end;
        });
        const notesContent = filteredNotes.map((note) => note.content);
        const sourcesContent = filteredSources.map((source) => source.summary);
        const summary = yield (0, Source_1.summarizeWorkspace)({
            notes: notesContent,
            sources: sourcesContent,
            workspaceName: workspace.name,
            generateReportText,
            openAIApiKey: user.openAikey
        });
        res.json({ summary });
    }
    catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({
            message: "An error occurred while generating the report.",
        });
    }
});
exports.generateReport = generateReport;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { noteIds, workspaceId } = req.body;
    if (!noteIds || !Array.isArray(noteIds)) {
        return res.status(400).json({
            message: "Invalid payload. Expected an array of note IDs.",
        });
    }
    try {
        const result = yield Note_1.default.deleteMany({ _id: { $in: noteIds } });
        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ message: "No notes found to delete." });
        }
        if (workspaceId) {
            const workspaceUpdate = yield Workspace_1.default.findByIdAndUpdate(workspaceId, { $pull: { notes: { $in: noteIds } } }, { new: true });
            if (!workspaceUpdate) {
                return res
                    .status(404)
                    .json({ message: "Workspace not found." });
            }
        }
        res.status(200).json({
            message: "Notes deleted successfully and removed from workspace.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.deleteNote = deleteNote;
const renameSource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name } = req.body;
    // Validate input
    if (!_id || !name) {
        return res.status(400).json({
            message: "Invalid request. '_id' and 'name' are required.",
        });
    }
    try {
        // Find the source by _id and update its name
        const updatedSource = yield Source_2.default.findByIdAndUpdate(_id, { name }, { new: true } // Return the updated document
        );
        if (!updatedSource) {
            return res.status(404).json({
                message: "Source not found.",
            });
        }
        res.status(200).json({
            message: "Source renamed successfully.",
            source: updatedSource,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
});
exports.renameSource = renameSource;
const removeSource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, workspaceId } = req.body;
    if (!_id) {
        return res.status(400).json({
            message: "Invalid request. '_id' is required.",
        });
    }
    try {
        const deletedSource = yield Source_2.default.findByIdAndDelete(_id);
        if (!deletedSource) {
            return res.status(404).json({
                message: "Source not found.",
            });
        }
        // If workspaceId is provided, remove the source reference from the workspace
        if (workspaceId) {
            const updatedWorkspace = yield Workspace_1.default.findByIdAndUpdate(workspaceId, { $pull: { sources: _id } }, // Remove the source reference
            { new: true } // Return the updated document
            );
            if (!updatedWorkspace) {
                return res.status(404).json({
                    message: "Workspace not found.",
                });
            }
        }
        else {
            // If no specific workspaceId is provided, remove the source reference from all workspaces
            yield Workspace_1.default.updateMany({ sources: _id }, { $pull: { sources: _id } } // Remove the source reference
            );
        }
        res.status(200).json({
            message: "Source removed successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
});
exports.removeSource = removeSource;
const renameWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name } = req.body;
    // Validate input
    if (!_id || !name) {
        return res.status(400).json({
            message: "Invalid request. '_id' and 'name' are required.",
        });
    }
    try {
        const updatedWorkspace = yield Workspace_1.default.findByIdAndUpdate(_id, { name }, { new: true } // Return the updated document
        );
        if (!updatedWorkspace) {
            return res.status(404).json({
                message: "Workspace not found.",
            });
        }
        res.status(200).json({
            message: "Workspace renamed successfully.",
            workspace: updatedWorkspace,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
});
exports.renameWorkspace = renameWorkspace;
