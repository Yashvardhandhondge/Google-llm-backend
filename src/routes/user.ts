import { Router } from "express";
import {
    createUser,
    getUser,
    saveOpenAikey,
    createNewWorkspace,
    getAllWorkspaces,
    getWorkspace,
    createNewNote,
    getAllNotes,
    createSource,
    getAllSources,
    createConversation,
    updateNote,
    getOpenAikey,
    googleAnalytics,
    deleteNote,
    renameSource,
    removeSource,
    renameWorkspace,
    getGaReport,
    getAllAccounts,
    getGaProperties,
    generateReport,
    getGaReportForWorkspace,
    createConversationOfSuggestion
} from "../controllers/userController";
import multer from "multer";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/signup", createUser);

// @ts-ignore
router.get("getUser/:clerkId", ClerkExpressRequireAuth(), getUser);

// @ts-ignore
router.get("/getAiKey/:clerkId", ClerkExpressRequireAuth(), getOpenAikey);

// @ts-ignore
router.post("/saveApiKey/:clerkId", ClerkExpressRequireAuth(), saveOpenAikey);

// @ts-ignore
router.post("/createNewWorkspace/:clerkId",ClerkExpressRequireAuth(),createNewWorkspace
);

// @ts-ignore
router.get("/getAllWorkspaces/:clerkId",ClerkExpressRequireAuth(), getAllWorkspaces
);

// @ts-ignore
router.get("/getWorkspace/:workspaceId",ClerkExpressRequireAuth(),getWorkspace
);

// @ts-ignore
router.post("/createNewNote/:workspaceId", ClerkExpressRequireAuth(), createNewNote);

// @ts-ignore
router.get("/getAllNotes/:workspaceId", ClerkExpressRequireAuth(), getAllNotes);

// @ts-ignore
router.put("/updateNote/:noteId", ClerkExpressRequireAuth(), updateNote);

// @ts-ignore
router.delete("/deleteNotes", ClerkExpressRequireAuth(), deleteNote);

// @ts-ignore
router.post("/createSource/:workspaceId", ClerkExpressRequireAuth(), upload.single("file"), createSource
);

// @ts-ignore
router.get("/getAllSources/:workspaceId", ClerkExpressRequireAuth(), getAllSources
);

// @ts-ignore
router.post("/createConversation", ClerkExpressRequireAuth(), createConversation
);

// @ts-ignore
router.post("/createConversation/suggestion", ClerkExpressRequireAuth(), createConversationOfSuggestion
);

// @ts-ignore
router.put("/rename-source", ClerkExpressRequireAuth(), renameSource);

// @ts-ignore
router.delete("/remove-source", ClerkExpressRequireAuth(), removeSource);

// @ts-ignore
router.put("/rename-workspace", ClerkExpressRequireAuth(), renameWorkspace);

// @ts-ignore
router.get("/oauth/google-analytics/callback", googleAnalytics);

// @ts-ignore
router.get("/analytics/accounts", ClerkExpressRequireAuth(), getAllAccounts);

// @ts-ignore
router.get("/analytics/report", ClerkExpressRequireAuth(), getGaReport);

// @ts-ignore
router.post("/analytics/report-for-workspace", ClerkExpressRequireAuth(), getGaReportForWorkspace);

// @ts-ignore
router.get("/analytics/properties", ClerkExpressRequireAuth(), getGaProperties);

// @ts-ignore
router.post("/getWorkspace-report/:workspaceId", ClerkExpressRequireAuth(), generateReport);

export default router;
