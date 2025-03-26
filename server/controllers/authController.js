const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
const { hashPassword, comparePassword } = require("../utils/helpers");

// Register a new user
async function register(req, res) {
  const { username, email, first_name, last_name, password, password_confirm } =
    req.body;

  if (
    !username ||
    !email ||
    !password ||
    !password_confirm ||
    !first_name ||
    !last_name
  ) {
    return res.status(422).json({ message: "Missing fields" });
  }

  if (password !== password_confirm)
    return res.status(422).json({ message: "Passwords do not match" });

  const sanitizedEmail = sanitize(email);
  const userExists = await User.exists({ email: sanitizedEmail });

  if (userExists) return res.sendStatus(409);

  try {
    const hashedPassword = await hashPassword(password);

    await User.create({
      email: sanitize(email),
      username: sanitize(username),
      password: hashedPassword,
      first_name: sanitize(first_name),
      last_name: sanitize(last_name),
    });

    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).json({ message: "Could not register" });
  }
}

// Login the user
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(422).json({ message: "Missing fields" });

  const sanitizedEmail = sanitize(email);
  const user = await User.findOne({ email: sanitizedEmail });

  if (!user)
    return res.status(401).json({ message: "Email or password is incorrect" });

  const match = await comparePassword(password, user.password);

  if (!match)
    return res.status(401).json({ message: "Email or password is incorrect" });

  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1800s",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );

  user.refresh_token = refreshToken;
  await user.save();

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ access_token: accessToken });
}

// Logout the user
async function logout(req, res) {
  const cookies = req.cookies;

  if (!cookies.refresh_token) return res.sendStatus(204);

  const refreshToken = cookies.refresh_token;
  const user = await User.findOne({ refresh_token: refreshToken });

  if (!user) {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  user.refresh_token = null;
  await user.save();

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.sendStatus(204);
}

// Assign a new token on refresh
async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies.refresh_token) return res.sendStatus(401);

  const refreshToken = cookies.refresh_token;

  const user = await User.findOne({ refresh_token: refreshToken });

  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1800s" },
    );

    console.log("New Access Token on Refresh:", accessToken);
    res.json({ access_token: accessToken });
  });
}

// DELETE User (Integration Test-Only Route)
async function deleteTestUser(req, res) {
  try {
    const { email } = req.body;
    const sanitizedEmail = sanitize(email);

    if (!sanitizedEmail)
      return res.status(400).json({ message: "Email is required" });

    await User.deleteOne({ email: sanitizedEmail }); // Delete user from DB
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user" });
  }
}

async function user(req, res) {
  const user = req.user;

  return res.status(200).json(user);
}

module.exports = { register, login, logout, refresh, user, deleteTestUser };
