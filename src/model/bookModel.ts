import mongoose, { Document, model, Schema } from "mongoose";

export interface IBook extends Document {
    title: string;
    author: string;
    publicationYear: number;
    isbn: string;
    description: string;
    image: string;
    addedBy: mongoose.Types.ObjectId; 
}

const bookSchema = new Schema<IBook>(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        publicationYear: { type: Number, required: true },
        isbn: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, 
    },
    { timestamps: true }
);

export default model<IBook>("Book", bookSchema);
