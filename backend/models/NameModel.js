import mongoose from 'mongoose';

const NameSchema = new mongoose.Schema({
  tokenId: Number,
  name: String,
}, { timestamps: true });

const NameModel = mongoose.model('Name', NameSchema);
export default NameModel;

