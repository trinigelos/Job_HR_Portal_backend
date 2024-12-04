const router = require("express").Router();
const authRoutes = require("./auth.routes");
const jobPostRoutes = require("./jobPostRoutes"); // Import the job post routes
const emailRoutes = require("./email.routes");


/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Prefix all job post routes with /jobposts
router.use("/jobposts", jobPostRoutes);


router.use("/auth", authRoutes);


router.use("/emails", emailRoutes);


module.exports = router;
