import mongoose, { Schema, Document } from "mongoose";

export interface ISource extends Document {
    name: string;
    url: string;
    summary: string;
}

const sourceSchema: Schema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        uploadType: {
            type: String,
        },
    },
    { timestamps: true }
);

const Source = mongoose.model<ISource>("Source", sourceSchema);
export default Source;
