import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema, 'todos');