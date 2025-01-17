### API Server setup

1.
```
npm init -y
npm i express mongodb mongoose dotenv body-parser nodemon
```

2. Create app.js
```
require('dotenv').config();

const express = require('express');
const products_routes = require('./routes/posts');
const connectDB = require("./db/connect");
require('dotenv').config();  // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Running in browser 🎉');
});

// Set up routes
app.use('/api/posts', products_routes);

const start = async () => {
    try {
        await connectDB();  // Connect to MongoDB
        app.listen(PORT, () => {
            console.log(`Yay!! Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

// Start the application
start();

```

3. Go to mongodb and create an account.

4. Select free plan and create a cluster with name as Neha-APIs

5. Go to database access. Then click on edit button, set an easy name and password

6. Go to network access. Then click on edit button, set the IP address to 0.0.0.0/0

7. Go to Databse -> Click on connect -> Drivers -> Copy your connection string into your application code inside .env file

8. MONGODB_URI = your string

9. create db/connect.js 
```
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from a .env file

// Correct the MongoDB URI, ensuring proper encoding and format
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);  // No need for useNewUrlParser and useUnifiedTopology
        console.log('Yay!! MongoDB connected successfully');
    } catch (error) {
        console.error('Oh no!! MongoDB connection failed:', error);
        process.exit(1);  // Exit the process with failure
    }
}

module.exports = connectDB;

```

10. create routes/ posts.js

```
const express = require('express');
const router = express.Router();

// Import controller functions
const { getAllPosts, createPost, updatePost, deletePost } = require('../controllers/posts');

// Route to get all posts
router.route('/').get(getAllPosts).post(createPost);

// Route to update a specific post by ID
router.route('/:id').put(updatePost);

// Route to delete a specific post by ID
router.route('/:id').delete(deletePost);

module.exports = router;
```

11. create controllers/ posts.js

```
const Post = require("../models/post");

// Get all posts
async function getAllPosts(req, res) {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

// Create a new post
async function createPost(req, res) {
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
}

// Update a post
async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
}

async function deletePost(req, res) {
  try {
    console.log('DELETE request received for ID:', req.params.id);

    const { id } = req.params; // Extract the ID from the route parameters
    const deletedPost = await Post.findByIdAndDelete(id); // Delete the post from the database
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
}

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};

```

12. Now we have to add some dummy data in DB. Create postDB.js

```
const connectDB = require("./db/connect");
const Post = require("./models/post");
const Product = require("./models/post");

const postsJson = require("./posts.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Post.create(postsJson);
    console.log("Yayy!! sucessfully created");
  } catch (err) {
    console.log(err);
  }
};

start();

```

13. This is models/post.js

```
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

```

14.  create posts.json

```
[
    {
        "title": "Paris Olympics 2024: Manu Bhaker wins historic bronze, opens India’s account.",
        "description": "hello I'm descriptino",
        "tags": [
            "sports"
        ],
        "location": "india",
        "createdAt": "07/08/2024",
        "imageURL": "https://images.news9live.com/wp-content/uploads/2024/07/Copy-of-Copy-of-Your-paragraph-text-3-9.jpg?w=1200&enlarge=true"
    }
]
```

14. Run the postDB only once using commend below.

```
node postDB
```

15. Check the mongoDB -> NEHA'S ORG > PROJECT 0 > DATABASES -> Click Browse Collection. You'll see test/posts.

16. Test CRUD in thunderclient or postman on localhost.

17. To publish the API. Go to Vercel and connect with GitHub -> New+ -> Publish.

    And you are done.
