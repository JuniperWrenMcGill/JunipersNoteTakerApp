const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const notes = require('./db/db.json');
const PORT = process.env.PORT || 3002;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard directs users to index.html 
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/index.html'))
// );

// api paths
app.get('/api/notes', (req, res) => {
  // const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Use uuidv4 to generate unique ID
  JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8'));
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
  res.json(notes);
});  

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  console.log('Received DELETE request for note with ID:', id);

  try {
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8'));
    console.log('Notes before deletion:', notes);
    notes = notes.filter(note => String(note.id) !== String(id)); 
    console.log('Notes after deletion:', notes);
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
    console.log('Note deleted successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);