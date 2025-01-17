const connectDB = require("./db/connect");
const Post = require("./models/post");

const postsJson = require("./posts.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Post.insertMany(postsJson, { ordered: false });
    console.log("Yayy!! sucessfully created");
  } catch (err) {
    console.log(err);
  }
};

start();
