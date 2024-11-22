const express = require("express");
const Gig = require("../models/Gig");
const User = require("../models/User");
const GigGuests = require("../models/GigGuests");
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  req.user = { userId: req.session.userId };
  next();
};

async function deleteGigCompletely(gigId) {
  try {
    await Gig.findByIdAndDelete(gigId);
    await User.updateMany({ gigs: gigId }, { $pull: { gigs: gigId } });
    await GigGuests.deleteMany({ gigId });

    console.log("Gig and all related records deleted successfully.");
    return { message: "Gig and all related records deleted successfully." };
  } catch (error) {
    console.error("Error deleting gig and related records:", error);
    throw error;
  }
}

async function deleteGigForGuest(gigId, userId) {
  try {
    const guestEntry = await GigGuests.findOne({ gigId, userId });
    if (!guestEntry) {
      throw new Error("Guest entry not found");
    }
    await GigGuests.deleteOne({ gigId, userId });
    await Gig.findByIdAndUpdate(
      gigId,
      {
        $inc: {
          musiciansCount: -guestEntry.musiciansCount,
          friendsCount: -guestEntry.friendsCount,
        },
      },
      { new: true }
    );

    await User.updateOne({ _id: userId }, { $pull: { gigs: gigId } });

    console.log("Gig removed from guest's list successfully.");
    return { message: "Gig removed from your list successfully." };
  } catch (error) {
    console.error("Error removing gig from guest's list:", error);
    throw error;
  }
}

// Route to create gig ---------------------------------------------------------
router.post("/", async (req, res) => {
  const {
    host,
    startTime,
    endTime,
    address,
    musiciansAllowed,
    friendsAllowed,
    instruments,
    comment,
  } = req.body;

  console.log("Received request to create Gig with data:", req.body);
  console.log("Looking for user with ID:", host);

  try {
    const userData = await User.findById(host);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPost = new Gig({
      host,
      address,
      startTime,
      endTime,
      musiciansAllowed,
      friendsAllowed,
      instruments,
      comment,
    });

    await newPost.save();
    console.log("Gig created successfully:", newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating gig:", error);
    res.status(500).json({ message: "Error creating gig", error });
  }
});

// Route to get all gigs -------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const posts = await Gig.find({
      startTime: { $gt: now },
      $expr: { $lt: ["$musiciansCount", "$musiciansAllowed"] },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a gig by ID ----------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const post = await Gig.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Gig not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a gig by ID (protected) ------------------------------------
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { userId, musiciansCount, friendsCount } = req.body;
    const updatedPost = await Gig.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          musiciansCount: musiciansCount || 0,
          friendsCount: friendsCount || 0,
        },
      },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ message: "Gig not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.gigs.push(updatedPost);
    await user.save();

    await GigGuests.create({
      gigId: updatedPost._id,
      userId: userId,
      musiciansCount: musiciansCount,
      friendsCount: friendsCount,
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a gig by ID (protected) ------------------------------------
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { isHost } = req.body;
    const gig = await Gig.findById(id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (isHost && gig.host.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this gig" });
    }

    if (isHost) {
      const result = await deleteGigCompletely(id, userId);
      res.json(result);
    } else {
      const result = await deleteGigForGuest(id, userId);
      res.json(result);
    }
  } catch (error) {
    console.error("Error deleting gig:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the gig" });
  }
});

// Route to get all gigs hosted by User ----------------------------------------
router.get("/host/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log(`Fetching meetings for userId: ${userId}`);

  try {
    const meetings = await Gig.find({ host: userId });
    console.log("Meetings found:", meetings);
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Error fetching meetings", error });
  }
});

// Route to get all gigs user is guesting in -----------------------------------
router.get("/guest/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log(`Fetching guesting meetings for userId: ${userId}`);

  try {
    const user = await User.findById(userId).populate({
      path: "gigs",
      populate: { path: "host" },
    });
    console.log("Meetings found:", user.gigs);

    res.status(200).json(user.gigs);
  } catch (error) {
    console.error("Error fetching guesting meetings:", error);
    res
      .status(500)
      .json({ message: "Error fetching guesting meetings", error });
  }
});

// Route to update a host gig by ID --------------------------------------------
router.put("/update/:id", async (req, res) => {
  const gigId = req.params.id;
  console.log("Gig ID from request:", gigId);

  const mongoose = require("mongoose");
  const id = new mongoose.Types.ObjectId(gigId);
  console.log("Converted ID:", id);

  let updatedData = req.body;
  console.log("Updated data:", updatedData);

  if (
    updatedData.address &&
    typeof updatedData.address.description === "object"
  ) {
    updatedData.address = {
      description: updatedData.address.description.description,
      latitude: updatedData.address.description.latitude,
      longitude: updatedData.address.description.longitude,
    };
  }

  try {
    const updatedGig = await Gig.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedGig) {
      console.log(`Gig with ID ${gigId} not found.`);
      return res.status(404).json({ message: "Gig not found" });
    }

    console.log("Gig updated successfully:", updatedGig);
    res.json(updatedGig);
  } catch (error) {
    console.error("Error updating gig with ID:", gigId, error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
