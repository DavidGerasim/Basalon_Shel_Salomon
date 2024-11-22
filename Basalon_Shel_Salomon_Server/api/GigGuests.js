const express = require("express");
const router = express.Router();
const GigGuests = require("../models/GigGuests");

router.get("/:gigId/:userId", async (req, res) => {
  try {
    const gigGuest = await GigGuests.findOne({
      gigId: req.params.gigId,
      userId: req.params.userId,
    });
    if (!gigGuest)
      return res.status(404).json({ message: "Gig Guest not found" });
    res.json(gigGuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
