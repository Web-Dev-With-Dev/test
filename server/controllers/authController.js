const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Password and Email Validators
function validPass(password) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 📌 REGISTER NEW USER
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // ✅ Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  if (!validPass(password)) {
    return res.status(400).json({ error: "Password must be 8+ characters with letter & number." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || "user" });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed." });
  }
};

// 📌 LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Basic check
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
};
