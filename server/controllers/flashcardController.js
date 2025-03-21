const Flashcard = require("../models/flashcards");
const auth = require("../middleware/auth-service");

async function verifyID(id, res) {
  if (!id) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  return true;
}

// Get all flashcards
async function index(req, res) {
  try {
    const id = auth.getUserID(req);
    if (!(await verifyID(id, res))) return;

    const flashcards = await Flashcard.find({ author: id }).populate(
      "author",
      "username"
    );
    return res.status(200).json({ flashcards });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching flashcards" });
  }
}

// Get all flashcards for the logged-in user
async function getUserFlashcards(req, res) {
  try {
    const id = auth.getUserID(req);
    if (!(await verifyID(id, res))) return;

    const flashcards = await Flashcard.find({ author: id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ flashcards });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching flashcards for logged-in user" });
  }
}

// Create a new flashcard
async function createFlashcard(req, res) {
  try {
    const id = auth.getUserID(req);
    if (!(await verifyID(id, res))) return;

    const { question, answer, setName } = req.body;
    if (!question || !answer || !setName) {
      return res.status(400).json({
        message: "Question and answer, and  setName are required",
      });
    }

    const newFlashcard = new Flashcard({
      question,
      answer,
      setName,
      author: id,
    });

    await newFlashcard.save();

    return res.status(201).json(newFlashcard);
  } catch (error) {
    return res.status(500).json({ message: "Error creating flashcard" });
  }
}

// Update a flashcard
async function updateFlashcard(req, res) {
  try {
    const id = auth.getUserID(req);
    if (!(await verifyID(id, res))) return;

    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    if (flashcard.author != id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.body.question !== undefined) {
      flashcard.question = req.body.question;
    }
    if (req.body.answer !== undefined) {
      flashcard.answer = req.body.answer;
    }
    if (req.body.setName !== undefined) {
      flashcard.setName = req.body.setName;
    }

    await flashcard.save();
    return res.status(200).json(flashcard);
  } catch (error) {
    return res.status(500).json({ message: "Error updating flashcard" });
  }
}

// Delete a flashcard
async function deleteFlashcard(req, res) {
  try {
    const id = auth.getUserID(req);
    if (!(await verifyID(id, res))) return;

    const flashcard = await Flashcard.findOne({ _id: req.params.id });
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    if (flashcard.author != id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await flashcard.deleteOne({ _id: req.params.id });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Error deleting flashcard" });
  }
}

// Get all flashcards in a specific folder
async function getFlashcardsBySetName(req, res) {
  try {
    const id = auth.getUserID(req);
    if (!(await verifyID(id, res))) return;

    const { setName } = req.params;
    if (!setName) {
      return res.status(400).json({ message: "setName is required" });
    }

    const flashcards = await Flashcard.find({ setName, author: id });

    if (!flashcards)
      return res.status(404).json({ message: "Flashcards not found" });

    return res.status(200).json({ flashcards: flashcards });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  verifyID,
  index,
  getUserFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcardsBySetName,
};
