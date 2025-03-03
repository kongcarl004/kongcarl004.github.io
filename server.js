const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's provided port or default to 3000

// Enable CORS for frontend-backend communication
app.use(cors());
app.use(express.json());

// Path to the JSON file for storing updates
const updatesFilePath = path.join(__dirname, "updates.json");

// Initialize the updates file if it doesn't exist
if (!fs.existsSync(updatesFilePath)) {
  fs.writeFileSync(updatesFilePath, JSON.stringify([]));
}

// Route to handle update submissions
app.post("/submit-update", (req, res) => {
  const { name, update } = req.body; // Get the name and update from the request body

  if (!name || !update) {
    return res.status(400).json({ error: "Name and update are required." });
  }

  // Read the existing updates
  const updates = JSON.parse(fs.readFileSync(updatesFilePath));

  // Add the new update at the beginning of the array (newest first)
  updates.unshift({
    name,
    update,
    timestamp: new Date().toLocaleString(),
  });

  // Write the updated updates back to the file
  fs.writeFileSync(updatesFilePath, JSON.stringify(updates, null, 2));

  res.json({ message: "Update submitted successfully!" });
});

// Route to get all updates (newest first)
app.get("/updates", (req, res) => {
  const updates = JSON.parse(fs.readFileSync(updatesFilePath));
  res.json(updates); // Updates are already stored in reverse chronological order
});

// Serve static files from the "public" folder
app.use(express.static("public"));

// Start the server and listen on all network interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});