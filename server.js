const express = require("express");
const db = require("./db/db.json");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readFromFile, readAndAppend } = require("./helpers/fsUtils");
const fs = require("fs");
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for feedback page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { text, title } = req.body;

  // If all the required properties are present
  if (text && text) {
    // Variable for the object we will save
    const newNote = {
      text,
      title,
      review_id: uuidv4(),
    };

    response = {
      status: "success",
      body: newNote,
    };
    readAndAppend(newNote, "./db/db.json");
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
