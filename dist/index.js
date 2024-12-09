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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const user_1 = __importDefault(require("./routes/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const API_URL = process.env.API_URL;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: API_URL,
    credentials: true,
}));
// app.use(cors())
// Clerk Middleware for Authentication
app.use((0, clerk_sdk_node_1.ClerkExpressWithAuth)());
// Routes
app.use("/api/users", user_1.default);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to MongoDB
    // await connectDB();
    console.log(`Server is running on port ${PORT}`);
}));
exports.default = app;
