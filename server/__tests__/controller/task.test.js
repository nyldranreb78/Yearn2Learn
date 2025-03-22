const {
  index,
  create,
  show,
  update,
  remove,
} = require("../../controllers/taskController");
const User = require("../../models/user");
const Task = require("../../models/task");
const auth = require("../../middleware/auth-service");
const Folder = require("../../models/folder");

jest.mock("../../models/user");
jest.mock("../../models/task");
jest.mock("../../middleware/auth-service");
jest.mock("../../models/folder");

describe("index", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if no id", async () => {
    auth.getUserID.mockReturnValue(null);

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return all tasks if id is valid", async () => {
    const mockID = "validID";
    auth.getUserID.mockReturnValue(mockID);
    const mockTasks = [{ name: "task1" }, { name: "task2" }];
    Task.find = jest.fn().mockResolvedValue(mockTasks);

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ tasks: mockTasks });
  });

  it("should return 500 if error", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.find = jest.fn().mockRejectedValue(new Error("error"));

    await index(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "error" });
  });
});

describe("create", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        folderID: "folderID",
        name: "name",
        taskGrade: "taskGrade",
        deadline: "deadline",
        isFishished: false,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if no id", async () => {
    auth.getUserID.mockReturnValue(null);

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 404 if user not found", async () => {
    auth.getUserID.mockReturnValue("validID");
    User.findOne = jest.fn().mockResolvedValue(null);

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should create task if user found", async () => {
    auth.getUserID.mockReturnValue("validID");
    User.findOne = jest.fn().mockResolvedValue({ _id: "validID" });
    const mockTask = { save: jest.fn().mockResolvedValue() };
    Task.mockImplementation(() => mockTask);

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ task: mockTask });
  });

  it("should return 500 if error", async () => {
    auth.getUserID.mockReturnValue("validID");
    User.findOne = jest.fn().mockRejectedValue(new Error("error"));

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "error" });
  });
});

describe("show", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "taskId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if no id", async () => {
    auth.getUserID.mockReturnValue(null);

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 404 if task not found", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockResolvedValue(null);

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
  });

  it("should return 401 if user is not author", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockResolvedValue({ author: "anotherID" });

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 200 and task if user is author", async () => {
    const mockID = "validID";
    const mockTask = { author: mockID };
    auth.getUserID.mockReturnValue(mockID);
    Task.findOne = jest.fn().mockResolvedValue(mockTask);

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task: mockTask });
  });

  it("should return 500 if error", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockRejectedValue(new Error("error"));

    await show(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "error" });
  });
});

describe("update", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "taskId",
      },
      body: {
        folderID: "folderID",
        name: "name",
        taskGrade: "taskGrade",
        deadline: "deadline",
        isFishished: false,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if no id", async () => {
    auth.getUserID.mockReturnValue(null);

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 404 if task not found", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockResolvedValue(null);

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
  });

  it("should return 401 if user is not author", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockResolvedValue({ author: "anotherID" });

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 200 and the updated task if user is author", async () => {
    const mockID = "validID";
    const mockTask = { author: mockID, save: jest.fn().mockResolvedValue() };
    auth.getUserID.mockReturnValue(mockID);
    Task.findOne = jest.fn().mockResolvedValue(mockTask);

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task: mockTask });
  });

  it("should return 500 if error", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockRejectedValue(new Error("error"));

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "error" });
  });
});

describe("remove", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "taskId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if ID is not valid", async () => {
    auth.getUserID.mockReturnValue(null);

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 404 if task not found", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockResolvedValue(null);

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
  });

  it("should return 401 if user is not author", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockResolvedValue({ author: "anotherID" });

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Invalid token",
    });
  });

  it("should return 200 and delete if user is author", async () => {
    const mockID = "validID";
    const mockTask = { author: mockID, name: "task1" };
    auth.getUserID.mockReturnValue(mockID);
    Task.findOne = jest.fn().mockResolvedValue(mockTask);
    Task.deleteOne = jest.fn().mockResolvedValue({ deleteCount: 1 });

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Task deleted" });
  });

  it("should return 500 if error", async () => {
    auth.getUserID.mockReturnValue("validID");
    Task.findOne = jest.fn().mockRejectedValue(new Error("error"));

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "error" });
  });
});
