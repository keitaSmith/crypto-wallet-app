const mongoose = require('mongoose');
const app = require('./App');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
mongoose.connect("mongodb://localhost:27017/mydatabase")
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the process with failure
  });