//jobPost.js

const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String },
  locationTerm: { type: String },
  description: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String },
  salaryRange: { type: String },
  employmentType: { type: String },
  employmentStyle: { type: String },
  applicationDeadline: { type: Date },
  contactEmail: { type: String },
  linkedinLink: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

jobPostSchema.index(
  { title: "text", company: "text", locationTerm: "text", description: "text" },
  {
    weights: {
      title: 10,
      company: 5,
      locationTerm: 5,
    },
    default_language: "spanish", // This setting avoids stemming and stop words filtering in your text search.
  }
);

const JobPost = mongoose.model("Job Post", jobPostSchema);

module.exports = JobPost;
