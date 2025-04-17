import express from 'express';
import TraitModel from '../models/TraitModel.js';

const router = express.Router();

// Save traits after minting
router.post("/", async (req, res) => {
  try {
    const { tokenId, traits } = req.body;
    const newEntry = await TraitModel.create({ tokenId, traits });
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save traits" });
  }
});

// Fetch traits by tokenId
router.get("/:tokenId", async (req, res) => {
  try {
    const trait = await TraitModel.findOne({ tokenId: req.params.tokenId });
    if (!trait) return res.status(404).json({ error: "Not found" });
    res.json(trait);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch traits" });
  }
});

export default router;
