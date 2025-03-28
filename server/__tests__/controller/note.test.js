const {
  index,
  getNotesInFolder,
  create,
  createInFolder,
  show,
  update,
  remove,
} = require("../../controllers/noteController");
const Note = require("../../models/note");
const auth = require("../../middleware/auth-service");
const Folder = require("../../models/folder");
const User = require("../../models/user");

jest.mock("../../middleware/auth-service");
jest.mock("../../models/note");
jest.mock("../../models/folder");
jest.mock("../../models/user");

describe("index", () => {
  let req, res;

  beforeEach(() => {
    req = {
      header: {
        authorization: "Bearer token",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return unauthorized if ID is not valid", async () => {
    auth.getUserID = jest.fn().mockReturnValue(undefined);

    Note.find.mockReturnValue({
      populate: jest.fn(),
    });

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return notes for valid ID", async () => {
    const mockID = "validID";
    const mockNotes = [
      { title: "Note 1", content: "Content of note 1", author: mockID },
      { title: "Note 2", content: "Content of note 2", author: mockID },
    ];
    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockNotes),
    });

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ notes: mockNotes });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Error fetching notes");
    auth.getUserID = jest.fn().mockReturnValue("validID");

    Note.find.mockImplementation(() => {
      throw mockError;
    });

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});

describe("getNotesInFolder", () => {
  let req, res;

  beforeEach(() => {
    req = {
      header: {
        authorization: "Bearer token",
      },
      params: {
        folderID: "folderID",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 404 if folder not found", async () => {
    const mockID = "validID";

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Folder.findOne.mockResolvedValue(null);

    await getNotesInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Folder not found" });
  });

  it("should return 403 if user is not the author of the folder", async () => {
    const mockID = "validID";
    const mockFolder = { author: "anotherID" };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Folder.findOne.mockResolvedValue(mockFolder);

    await getNotesInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should return 200 with notes in folder", async () => {
    const mockID = "validID";
    const mockFolder = { author: mockID, notes: ["noteID1", "noteID2"] };
    const mockNotes = [
      { title: "note1", content: "Content of note 1" },
      { title: "note2", content: "Content of note 2" },
    ];

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Folder.findOne.mockResolvedValue(mockFolder);
    Note.find.mockResolvedValue(mockNotes);

    await getNotesInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ notes: mockNotes });
  });

  it("should return 404 if notes not found", async () => {
    const mockID = "validID";
    const mockFolder = { author: mockID, notes: [] };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Folder.findOne.mockResolvedValue(mockFolder);
    Note.find.mockResolvedValue(null);

    await getNotesInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Notes not found" });
  });

  it("should handle errors with Folder.findOne", async () => {
    const mockError = new Error("Error fetching folder");
    auth.getUserID = jest.fn().mockReturnValue("validID");
    Folder.findOne.mockImplementation(() => {
      throw mockError;
    });

    await getNotesInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });

  it("should handle errors with Note.find", async () => {
    const mockError = new Error("Error fetching notes");
    const mockID = "validID";
    const mockFolder = { author: mockID, notes: ["noteID1", "noteID2"] };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Folder.findOne.mockResolvedValue(mockFolder);
    Note.find.mockImplementation(() => {
      throw mockError;
    });

    await getNotesInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});

describe("create", () => {
  let req, res;

  beforeEach(() => {
    req = {
      header: {
        authorization: "Bearer token",
      },
      body: {
        title: "Note 1",
        content: "Content of note 1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 401 if ID is not valid", async () => {
    auth.getUserID = jest.fn().mockReturnValue(undefined);

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 500 if id is valid but user is not found", async () => {
    const mockID = "validID";
    auth.getUserID = jest.fn().mockReturnValue(mockID);
    User.findOne.mockResolvedValue(null);

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 201 with new note", async () => {
    const mockID = "validID";
    const mockUser = { _id: mockID };
    const mockNote = {
      title: "Note 1",
      content: "Content of note 1",
      author: mockID,
      save: jest.fn().mockResolvedValue(), // mock save method
    };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    User.findOne.mockResolvedValue(mockUser);
    Note.mockImplementation(() => mockNote);

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ note: mockNote });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Error creating note");
    auth.getUserID = jest.fn().mockReturnValue("validID");
    User.findOne.mockResolvedValue({ _id: "validID" });
    Note.mockImplementation(() => {
      throw mockError;
    });

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});

describe("createInFolder", () => {
  let req, res;

  beforeEach(() => {
    req = {
      header: {
        authorization: "Bearer token",
      },
      params: {
        folderID: "folderID",
      },
      body: {
        title: "Note 1",
        content: "Content of note 1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    auth.getUserID = jest.fn();
    User.findOne.mockReset();
    Folder.findOne.mockReset();
    Note.prototype.save = jest.fn().mockResolvedValue();
    Folder.prototype.save = jest.fn().mockResolvedValue();
  });

  it("should return 401 if ID is not valid", async () => {
    auth.getUserID = jest.fn().mockReturnValue(undefined);

    await createInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 500 if user is not found", async () => {
    const mockID = "validID";
    auth.getUserID = jest.fn().mockReturnValue(mockID);
    User.findOne.mockResolvedValue(null);

    await createInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 404 if folder is not found", async () => {
    const mockID = "validID";
    auth.getUserID = jest.fn().mockReturnValue(mockID);
    User.findOne.mockResolvedValue({ _id: mockID });
    Folder.findOne.mockResolvedValue(undefined);

    await createInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Folder not found" });
  });

  it("should return 403 if user is not the author of the folder", async () => {
    const mockID = "validID";
    const mockFolder = { author: "anotherID" };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    User.findOne.mockResolvedValue({ _id: mockID });
    Folder.findOne.mockResolvedValue(mockFolder);

    await createInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should return 201 if all conditions are met", async () => {
    const mockID = "validID";
    const mockFolder = {
      author: mockID,
      notes: [],
      _id: "folderID",
      save: jest.fn().mockResolvedValue(), // mock save method
    };
    const mockUser = { _id: mockID };
    const mockNote = {
      title: "Note 1",
      content: "Content of note 1",
      folder: mockFolder._id,
      author: mockID,
      save: jest.fn().mockResolvedValue(), // mock save method
    };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    User.findOne.mockResolvedValue(mockUser);
    Folder.findOne.mockResolvedValue(mockFolder);
    Note.mockImplementation(() => mockNote);

    await createInFolder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      folder: mockFolder,
      note: mockNote,
    });
  });
});

describe("show", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        noteID: "noteID",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 401 if ID is not valid", async () => {
    auth.getUserID = jest.fn().mockReturnValue(undefined);

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 404 if note is not found", async () => {
    const mockID = "validID";
    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(null);

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  it("should return 403 if user is not the author of the note", async () => {
    const mockID = "validID";
    const mockNote = { author: "anotherID" };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(mockNote);

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should return 200 when all condition are met", async () => {
    const mockID = "validID";
    const mockNote = { author: mockID };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(mockNote);

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ note: mockNote });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Error fetching note");
    auth.getUserID = jest.fn().mockReturnValue("validID");
    Note.findOne.mockImplementation(() => {
      throw mockError;
    });

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});

describe("update", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        noteID: "noteID",
      },
      body: {
        title: "Note 1",
        content: "Content of note 1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 401 if ID is not valid", async () => {
    auth.getUserID = jest.fn().mockReturnValue(undefined);

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 404 if note is not found", async () => {
    const mockID = "validID";

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(null);

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  it("should return 403 if user is not the author of the note", async () => {
    const mockID = "validID";
    const mockNote = { author: "anotherID" };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(mockNote);

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should return 200 if all conditions are met and update the note", async () => {
    const mockID = "validID";
    const mockNote = {
      author: mockID,
      save: jest.fn().mockResolvedValue(),
      title: "Note",
      content: "Content",
    };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(mockNote);

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ note: mockNote });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Error updating note");
    auth.getUserID = jest.fn().mockReturnValue("validID");
    Note.findOne.mockImplementation(() => {
      throw mockError;
    });

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});

describe("remove", () => {
  beforeEach(() => {
    req = {
      params: {
        noteID: "noteID",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 401 if ID is not valid", async () => {
    auth.getUserID = jest.fn().mockReturnValue(undefined);

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 404 if note is not found", async () => {
    const mockID = "validID";

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(null);

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  it("should return 403 if user is not the author of the note", async () => {
    const mockID = "validID";
    const mockNote = { author: "anotherID" };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(mockNote);

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should return 200 if all conditions are met and remove the note", async () => {
    const mockID = "validID";
    const mockNote = {
      author: mockID,
      deleteOne: jest.fn().mockResolvedValue(),
    };

    auth.getUserID = jest.fn().mockReturnValue(mockID);
    Note.findOne.mockResolvedValue(mockNote);

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Note deleted" });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Error deleting note");
    auth.getUserID = jest.fn().mockReturnValue("validID");
    Note.findOne.mockImplementation(() => {
      throw mockError;
    });

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});
