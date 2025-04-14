const User = require("../models/user");
const Note = require("../models/note");
const Folder = require("../models/folder");
const auth = require("../middleware/auth-service");
const folder = require("../models/folder");

async function verifyID(id, res) {
  if (!id) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  return true;
}

async function index(req, res) {
  try {
    const id = auth.getUserID(req);

    if (!(await verifyID(id, res))) return;

    const folders = await Folder.find({ author: id });
    folder.populate("author", "username", "user");
    return res.status(200).json({ folders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function create(req, res) {
  try {
    const id = auth.getUserID(req);

    if (!(await verifyID(id, res))) return;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const folder = new Folder({
      name: req.body.name,
      priority: req.body.priority,
    });

    folder.author = user._id;
    folder.save();

    return res.status(201).json({ folder: folder });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function show(req, res) {
  try {
    const id = auth.getUserID(req);

    if (!(await verifyID(id, res))) return;

    const folder = await Folder.findOne({ _id: req.params.id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (folder.author != id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ folder: folder });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const id = auth.getUserID(req);

    if (!(await verifyID(id, res))) return;

    // Find the folder
    const folder = await Folder.findOne({ _id: req.params.id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (folder.author != id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update only if new values are provided
    if (req.body.name) folder.name = req.body.name;
    if (req.body.priority !== undefined) folder.priority = req.body.priority;

    await folder.save();
    return res.status(200).json({ folder: folder });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function remove(req, res) {
  const id = auth.getUserID(req);

  if (!(await verifyID(id, res))) return;

  try {
    const folder = await Folder.findOne({ _id: req.params.id });

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (folder.author != id)
      return res.status(403).json({ message: "Unauthorized" });

    await Note.deleteMany({ _id: { $in: folder.notes } });
    await folder.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Folder deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function removeAll(req, res) {
  const id = auth.getUserID(req);

  if (!(await verifyID(id, res))) return;

  try {
    const folders = await Folder.find({ author: id });

    if (!folders) return res.status(404).json({ message: "Folders not found" });

    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];
      await Note.deleteMany({ _id: { $in: folder.notes } });
      await folder.deleteOne({ _id: folder._id });
    }

    return res.status(200).json({ message: "All folders deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { index, create, show, update, remove, removeAll };
