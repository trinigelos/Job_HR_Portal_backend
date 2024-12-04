const express = require("express");
const router = express.Router();
const Email = require("../models/email");

// Route to handle email subscriptions
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    // Save email to the database
    const newEmail = new Email({ email });
    await newEmail.save();

    res.status(200).json({ message: "Email suscrito exitosamente" });
  } catch (error) {
    console.error("Error al guardar el email:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;