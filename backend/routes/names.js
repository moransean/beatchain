import express from 'express';
import NameModel from '../models/NameModel.js';

const router = express.Router();

// Save name after minting
router.post("/", async (req, res) => {
  try {
    const { tokenId, name } = req.body;
    const newEntry = await NameModel.create({ tokenId, name });
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save name" });
  }
});

// Fetch name by tokenId
router.get("/:tokenId", async (req, res) => {
  try {
    const name = await NameModel.findOne({ tokenId: req.params.tokenId });
    if (!name) return res.status(404).json({ error: "Not found" });
    res.json(name);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch name" });
  }
});

export default router;
