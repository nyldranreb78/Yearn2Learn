const {
  index,
  getUserFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcardsBySetName,
} = require("../../controllers/flashcardController");

const Flashcard = require("../../models/flashcards");
const auth = require("../../middleware/auth-service");

jest.mock("../../middleware/auth-service");
jest.mock("../../models/flashcards");

describe("Flashcard Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "validFlashcardID", setName: "JavaScript Basics" },
      body: {
        question: "New Question",
        answer: "New Answer",
        setName: "Tech",
      },
      header: jest.fn().mockReturnValue("Bearer token"),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Unauthorized access for index
  it("should return 401 if user ID is invalid in index", async () => {
    auth.getUserID.mockReturnValue(undefined);
    await index(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  // Fetch flashcards successfully
  it("should return flashcards for valid user in index", async () => {
    const mockID = "validUserID";
    const mockFlashcards = [
      {
        question: "MEVN?",
        answer: "Mongo, Express, Vue, Node",
        author: mockID,
        setName: "Tech",
      },
    ];

    auth.getUserID.mockReturnValue(mockID);
    Flashcard.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockFlashcards),
    });

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ flashcards: mockFlashcards });
  });

  // Handle error in index
  it("should return 500 when index encounters an error", async () => {
    auth.getUserID.mockReturnValue("validID");
    Flashcard.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching flashcards",
    });
  });

  // Get flashcards for logged-in user
  it("should return flashcards sorted for logged-in user", async () => {
    const mockFlashcards = [
      {
        question: "What is JavaScript?",
        answer: "A programming language",
        setName: "Coding",
      },
    ];
    auth.getUserID.mockReturnValue("validUserID");
    Flashcard.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockFlashcards),
    });

    await getUserFlashcards(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ flashcards: mockFlashcards });
  });

  // Handle error when fetching user flashcards
  it("should return 500 if fetching flashcards fails", async () => {
    auth.getUserID.mockReturnValue("validUserID");
    Flashcard.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getUserFlashcards(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching flashcards for logged-in user",
    });
  });

  // Create a flashcard
  it("should create a flashcard successfully", async () => {
    const mockUserID = "validUserID";

    auth.getUserID.mockReturnValue(mockUserID);
    Flashcard.prototype.save = jest.fn().mockResolvedValue({
      question: "New Question",
      answer: "New Answer",
      setName: "Tech",
      author: mockUserID,
    });

    await createFlashcard(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  // Handle error when creating a flashcard
  it("should return 500 if flashcard creation fails", async () => {
    const mockUserID = "validUserID";

    auth.getUserID.mockReturnValue(mockUserID);
    Flashcard.prototype.save = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await createFlashcard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error creating flashcard",
    });
  });

  // Update flashcard successfully
  it("should update flashcard details if user is authorized", async () => {
    const mockFlashcard = {
      author: "validUserID",
      save: jest.fn().mockResolvedValue(),
    };
    auth.getUserID.mockReturnValue("validUserID");
    Flashcard.findById.mockResolvedValue(mockFlashcard);

    await updateFlashcard(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockFlashcard);
  });

  // Handle unauthorized flashcard update
  it("should return 403 if user is not the owner of the flashcard", async () => {
    const mockFlashcard = { author: "anotherUserID" };
    auth.getUserID.mockReturnValue("validUserID");
    Flashcard.findById.mockResolvedValue(mockFlashcard);

    await updateFlashcard(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  // Delete a flashcard
  it("should delete a flashcard if user is authorized", async () => {
    const mockFlashcard = {
      author: "validUserID",
      deleteOne: jest.fn().mockResolvedValue(),
    };
    auth.getUserID.mockReturnValue("validUserID");
    Flashcard.findOne.mockResolvedValue(mockFlashcard);

    await deleteFlashcard(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  // Handle deleting non-existent flashcard
  it("should return 404 if flashcard is not found", async () => {
    auth.getUserID.mockReturnValue("validUserID");
    Flashcard.findOne.mockResolvedValue(null);

    await deleteFlashcard(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Flashcard not found" });
  });

  // Getting flashcards with a missing setName
  it("should return 400 if setName is missing", async () => {
    req.params.setName = "";

    auth.getUserID.mockReturnValue("validUserID");

    await getFlashcardsBySetName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "setName is required",
    });
  });

  // Getting flashcards with a setName
  it("should return 200 with flashcards if found", async () => {
    auth.getUserID.mockReturnValue("validUserID");

    const mockFlashcards = [
      { _id: "1", question: "What is JS?", answer: "JavaScript" },
      { _id: "2", question: "What is Node.js?", answer: "Runtime for JS" },
    ];
    Flashcard.find.mockResolvedValue(mockFlashcards);

    await getFlashcardsBySetName(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      flashcards: mockFlashcards,
    });
  });

  // No flashcards for a particular setName
  it("should return 404 if no flashcards are found", async () => {
    auth.getUserID.mockReturnValue("validUserID");

    Flashcard.find.mockResolvedValue(null);

    await getFlashcardsBySetName(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Flashcards not found",
    });
  });
});
