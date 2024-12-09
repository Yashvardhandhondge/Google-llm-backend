import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    email: string;
    createdAt: Date;
    openAikey: string;
    propertyId: string;
    googleAnalytics: string;
    googleRefreshToken: string;
    workspaces: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    openAikey: { type: String, default: "" },
    googleAnalytics: { type: String, default: "" },
    googleRefreshToken: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    workspaces: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", default: [] },
    ],
    propertyId: {
        type: String,
        default: "",
    },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
