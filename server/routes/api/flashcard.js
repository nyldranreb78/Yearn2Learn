const express = require("express");
const router = express.Router();
const controller = require("../../controllers/flashcardController");
const auth = require("../../middleware/auth-service");

// Get all flashcards
router.get("/", auth.verifyToken, controller.index);

// Get all flashcards for the logged-in user
router.get("/user", auth.verifyToken, controller.getUserFlashcards);

// Create a new flashcard
router.post("/", auth.verifyToken, controller.createFlashcard);

// Update a flashcard
router.patch("/:id", auth.verifyToken, controller.updateFlashcard);

// Delete a flashcard
router.delete("/:id", auth.verifyToken, controller.deleteFlashcard);

// Get all flashcards with similar setNames
router.get(
  "/set/:setName",
  auth.verifyToken,
  controller.getFlashcardsBySetName,
);

module.exports = router;
