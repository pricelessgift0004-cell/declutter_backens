const express = require("express");
const Event = require("../models/Event");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/dashboard", adminAuth, async (req, res) => {
  const totalProducts = await Event.countDocuments({ type: "view" });
  const totalActivity = await Event.countDocuments();
  const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(10);

  res.json({
    totalProducts,
    totalActivity,
    recentEvents
  });
});

// Chart-ready endpoint
router.get("/chart", adminAuth, async (req, res) => {
  const data = await Event.aggregate([
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(data);
});

module.exports = router;
