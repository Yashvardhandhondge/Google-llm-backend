"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.post("/signup", userController_1.createUser);
// @ts-ignore
router.get("getUser/:clerkId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getUser);
// @ts-ignore
router.get("/getAiKey/:clerkId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getOpenAikey);
// @ts-ignore
router.post("/saveApiKey/:clerkId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.saveOpenAikey);
// @ts-ignore
router.post("/createNewWorkspace/:clerkId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.createNewWorkspace);
// @ts-ignore
router.get("/getAllWorkspaces/:clerkId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getAllWorkspaces);
// @ts-ignore
router.get("/getWorkspace/:workspaceId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getWorkspace);
// @ts-ignore
router.post("/createNewNote/:workspaceId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.createNewNote);
// @ts-ignore
router.get("/getAllNotes/:workspaceId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getAllNotes);
// @ts-ignore
router.put("/updateNote/:noteId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.updateNote);
// @ts-ignore
router.delete("/deleteNotes", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.deleteNote);
// @ts-ignore
router.post("/createSource/:workspaceId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), upload.single("file"), userController_1.createSource);
// @ts-ignore
router.get("/getAllSources/:workspaceId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getAllSources);
// @ts-ignore
router.post("/createConversation", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.createConversation);
// @ts-ignore
router.post("/createConversation/suggestion", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.createConversationOfSuggestion);
// @ts-ignore
router.put("/rename-source", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.renameSource);
// @ts-ignore
router.delete("/remove-source", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.removeSource);
// @ts-ignore
router.put("/rename-workspace", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.renameWorkspace);
// @ts-ignore
router.get("/oauth/google-analytics/callback", userController_1.googleAnalytics);
// @ts-ignore
router.get("/analytics/accounts", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getAllAccounts);
// @ts-ignore
router.get("/analytics/report", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getGaReport);
// @ts-ignore
router.post("/analytics/report-for-workspace", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getGaReportForWorkspace);
// @ts-ignore
router.get("/analytics/properties", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.getGaProperties);
// @ts-ignore
router.post("/getWorkspace-report/:workspaceId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), userController_1.generateReport);
exports.default = router;
