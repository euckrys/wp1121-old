import mongoose from "mongoose";

const diarySchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        tag: {
            type: String,
            required: true
        },
        mood: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
        timestamps: true,
    },
);

const DiaryModel = mongoose.model("Diary", diarySchema);

export default DiaryModel;