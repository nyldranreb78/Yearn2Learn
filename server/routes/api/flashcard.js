const express = require("express");
const router = express.Router();
const controller = require("../../controllers/flashcardController");
const auth = require("../../middleware/auth-service");

// Get all flashcards
router.get("/", auth.verifyToken, controller.index);

// Get all flashcards for the logged-in user
router.get("/user", auth.verifyToken, controller.getUserFlashcards);

// Create a new flashcard
router.post("/:folderID/", auth.verifyToken, controller.createFlashcard);

// Update a flashcard
router.patch("/:id", auth.verifyToken, controller.updateFlashcard);

// Delete a flashcard
router.delete("/:id", auth.verifyToken, controller.deleteFlashcard);

// Get all flashcards in folder
router.get('/:folderID/flashcards', auth.verifyToken, controller.getFlashcardsByFolder);

module.exports = router;
