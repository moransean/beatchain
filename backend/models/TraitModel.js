import mongoose from 'mongoose';

const TraitSchema = new mongoose.Schema({
  tokenId: Number, // You can populate this after minting
  traits: {
    tempo: Number,
    genre: String,
    melodyComplexity: Number,
    bassDepth: Number,
    percussionIntensity: Number,
    reverbAmount: Number,
    key: String
  },
  finalized: { type: Boolean, default: false }, // You can use this if needed
}, { timestamps: true });

const TraitModel = mongoose.model('Trait', TraitSchema);
export default TraitModel;

