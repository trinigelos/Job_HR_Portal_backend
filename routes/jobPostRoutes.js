// jobPostRoutes.js

const express = require("express");
const router = express.Router();
const JobPost = require("../models/jobPost");
const Session = require("../models/Session.model");


// Middleware to verify the session token
const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    // Find the session by token
    const session = await Session.findById(accessToken);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    req.userData = { userId: session.user };
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// Create a new job post (requires authentication)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const jobPost = new JobPost({
      ...req.body,
      postedBy: req.userData.userId, // Use the userId from the verified session
    });

    const savedJobPost = await jobPost.save();
    res.status(201).json(savedJobPost);
  } catch (error) {
    console.error("Error creating job post:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get all job posts (public)
router.get("/", async (req, res) => {
  const { searchTerm, locationTerm } = req.query;

  // Initialize filter with non-deleted items
 // Backend filter update logic to ensure the search works as intended
 let filter = { isDeleted: false };

 if (searchTerm || locationTerm) {
   filter.$or = [];
 
   if (searchTerm) {
     filter.$or.push(
       { title: { $regex: searchTerm, $options: "i" } },

     );
   }
 
   if (locationTerm) {
     filter.$or.push({ locationTerm: { $regex: locationTerm, $options: "i" } });
   }
 }

 // Log the constructed filter to verify
 console.log("Filter:", JSON.stringify(filter));
  
  try {
    const jobPosts = await JobPost.find(filter);
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single job post by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.id);
    if (!jobPost) {
      return res.status(404).json({ message: "Job Post not found" });
    }
    res.status(200).json(jobPost);
  } catch (error) {
    console.error("Error fetching job post:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a job post (requires authentication)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedJobPost = await JobPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedJobPost) {
      return res.status(404).json({ message: "Job Post not found" });
    }
    res.status(200).json(updatedJobPost);
  } catch (error) {
    console.error("Error updating job post:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a job post (requires authentication)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job Post not found" });
    }
    job.isDeleted = true;
    job.deletedAt = new Date();
    await job.save();
    res.status(200).json({ message: "Job marked as deleted." });
  } catch (error) {
    console.error("Error deleting the job post:", error);
    res.status(500).json({ message: "Error deleting the job post." });
  }
});

// Restore a deleted job post (requires authentication)
router.post("/restore/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job Post not found" });
    }
    job.isDeleted = false;
    job.deletedAt = null;
    await job.save();
    res.status(200).json({ message: "Job restored." });
  } catch (error) {
    console.error("Error restoring job post:", error);
    res.status(500).json({ message: "Error restoring the job post." });
  }
});

module.exports = router;
