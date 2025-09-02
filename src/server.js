const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const https = require('https');

app.use(express.json());

const allowedOrigins = ['http://localhost:4200'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Connect to MongoDB (replace <YOUR_MONGODB_URI> with your actual URI)
const db1 = mongoose.createConnection('mongodb://localhost:27017/');
// const db2 = mongoose.createConnection('mongodb://192.168.130.34:27017/facebook', { useNewUrlParser: true, useUnifiedTopology: true });


const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  link: String,
  publishedAt: String,
  language: String,
  image_url: String,
  source_id: String,
  pubDate: String,
  country: String,
  searchQuery: String
});

const youtubeSchema = new mongoose.Schema({
  videoID: String,
  title: String,
  channelName: String,
  publishedDate: String,
  description: String,
  searchQuery: String,
  fullDescription: String,
  tags: Object
});

const elibrarySchema = new mongoose.Schema({
  meta_CreationDate: String,
  filename: String,
  meta_Producer: String,
  source: String,
  meta_Creator: String,
  source_short: String,
  Converted_filename: String,
  source_link: String,
  cover: String,
  published_Date: String,
  site_Title: String,
});

const userSchema = new mongoose.Schema({
  id: String,
  userId: { type: String, unique: true, required: true },
  fullName: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'user'] },
  username: String
});

const newsKeywordSchema = new mongoose.Schema({
  group_name: String,
  group_id: String,
  keywords: [{ searchEnabled: Boolean, word: String }],
});


const facebookSchema = new mongoose.Schema({
  description: String,
  imagehash_0: String,
  title: String,
});

const fbKeywordSchema = new mongoose.Schema({
  search: String
});

// const Facebook = db2.model('Facebook', facebookSchema, 'facebook_collection');
// const FbKeyword = db2.model('FbKeyword', fbKeywordSchema, 'search');
const NewsKeyword = db1.model('NewsKeyword', newsKeywordSchema);
const News = db1.model('News', newsSchema);
const Youtube = db1.model('Youtube', youtubeSchema);
const Elibrary = db1.model('Elibrary', elibrarySchema, 'elibrary');
const User = db1.model('User', userSchema);

// Define a route to handle POST requests

// News Route
app.post('/api/news', async (req, res) => {
  // console.log("succesful");
  try {
    // Create a new document based on the incoming request data
    const news = new News(req.body);
    // Save the document to the database
    await news.save();
    res.status(200).send('Data saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data to MongoDB');
  }
});

//Youtube Route
app.post('/api/youtube', async (req, res) => {
  // console.log("succesful");
  try {
    // Create a new document based on the incoming request data
    const youtube = new Youtube(req.body);
    // Save the document to the database
    await youtube.save();
    res.status(200).send('Data saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data to MongoDB');
  }
});

// Define a route to handle GET requests
app.get('/api/news', async (req, res) => {
  const searchTerm = req.query.q; // Extract the search query from the request query parameters
  const language = req.query.language; // Extract the language from the request query parameters
  try {
    let pipeline = [];

    if (searchTerm) {
      // If a search term is provided, search by keywords
      pipeline.push(
        {
          $match: { title: { $regex: searchTerm, $options: 'i' } }
        }
      );
    } else {
      // If no search term is provided, fetch top 50 news
      pipeline.push(
        { $sort: { publishedAt: -1 } }, // Sort by publishedAt in descending order
        { $limit: 100 }
      );
    }
    if (language) {
      // Add language filter if language is provided
      pipeline.push(
        { $match: { language: language } }
      );
    }
    pipeline.push(
      { $group: { _id: "$title", doc: { $first: "$$ROOT" } } },
      { $replaceWith: "$doc" }
    );

    const newsData = await News.aggregate(pipeline);
    res.json(newsData); // Send the data as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from MongoDB');
  }
});

//fetch elibrary data
app.get('/api/elibrary', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const folderName = req.query.folderName; // Extract the folderName from the request query parameters
    const limit = parseInt(req.query.limit) || 50; // Default to 50 if 'limit' is not provided
    let query = {};
    if (searchTerm) {
      query.filename = { $regex: searchTerm, $options: 'i' };
    }
    if (folderName) {
      query.source_short = folderName; // Filter by folderName if provided
    }
    const elibraryData = await Elibrary.find(query).limit(limit);
    res.json(elibraryData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching elibrary data from MongoDB');
  }
});

//pdf search
app.get('/api/pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'path/to/pdf', filename);
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a response
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// Generate unique userId (incrementing ID)
let currentUserId = 0;
function generateUniqueUserId() {
  currentUserId++;
  return currentUserId.toString().padStart(3, '0');
}

// API endpoint to register a new user
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, role, username } = req.body;
    const userId = generateUniqueUserId();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role, username, userId });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed.' });
  }
});

// API endpoint to handle user login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    const { _id, fullName, email: userEmail, role, username } = user;
    res.status(200).json({ message: 'Login successful.', user: { _id, fullName, email: userEmail, role, username } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// API Endpoint to fetch news from MongoDB based on keywords
app.get('/api/news/:keywords', (req, res) => {
  const keywords = req.params.keywords.split(',');
  News.find(
    {
      $or: [
        { title: { $regex: keywords.join('|'), $options: 'i' } },
      ]
    },
    (error, result) => {
      if (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).send(error);
      } else {
        console.log('Data fetched from MongoDB:', result);
        res.status(200).send(result);
      }
    }
  );
});

// API endpoint to fetch groups and keywords from MongoDB
app.get('/api/newskeyword', async (req, res) => {
  try {
    const newsKeywordData = await NewsKeyword.find();
    res.json(newsKeywordData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching groups and keywords from MongoDB');
  }
});

// API endpoint to add or update groups and keywords in MongoDB
app.post('/api/newskeyword', async (req, res) => {
  try {
    const groupsAndKeywords = req.body;
    await NewsKeyword.deleteMany(); // Clear existing groups and keywords
    await NewsKeyword.insertMany(groupsAndKeywords); // Insert new groups and keywords
    res.status(200).json({ message: 'Groups and keywords saved to MongoDB' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving groups and keywords to MongoDB');
  }
});

// API endpoint to delete a group and its keywords from MongoDB
app.delete('/api/newskeyword/:groupId', async (req, res) => {
  const groupId = req.params.groupId;
  try {
    await NewsKeyword.deleteOne({ group_id: groupId });
    res.status(200).json({ message: 'Group and keywords deleted from MongoDB' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting group and keywords from MongoDB');
  }
});

//API endpoint to handle facebook
// app.get('/api/facebook/news', async (req, res) => {
//   const keywords = req.query.keywords;
//   try {
//     const searchData = await Facebook.find({
//       $or: [
//         { title: { $regex: keywords, $options: 'i' } },
//         { description: { $regex: keywords, $options: 'i' } },
//       ],
//     });
//     res.json(searchData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching data from MongoDB');
//   }
// });


// API endpoint to fetch Facebook keywords
// app.get('/api/facebook/keywords', async (req, res) => {
//   try {
//     const keywords = await FbKeyword.find();
//     res.json(keywords);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching keywords from MongoDB');
//   }
// });

// API endpoint to update a keyword
// app.put('/api/facebook/keywords/:id', async (req, res) => {
//   const id = req.params.id;
//   const { search } = req.body;
//   try {
//     await FbKeyword.findByIdAndUpdate(id, { search });
//     res.status(200).json({ message: 'Keyword updated successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error updating keyword in MongoDB');
//   }
// });

// API endpoint to delete a keyword
// app.delete('/api/facebook/keywords/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     await FbKeyword.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Keyword deleted successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error deleting keyword from MongoDB');
//   }
// });


// console.log('__dirname:', __dirname);
// // Specify the path to your SSL/TLS certificates
// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, '/assets/server.key')),
//   cert: fs.readFileSync(path.join(__dirname, '/assets/server.crt')),
// };
// // Create an HTTPS server
// const server = https.createServer(sslOptions, app);
// Start the server
// server.listen(port, () => {
//   console.log(`Server running on https://localhost:${port}`);
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})
