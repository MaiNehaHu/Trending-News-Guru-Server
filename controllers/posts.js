const mongoose = require("mongoose");
const Post = require("../models/post");

require("dotenv").config();

const aws = require("aws-sdk");
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: "latest",
  region: process.env.REGION,
});

// Updated translate function with caching
async function translateText(text, targetLang) {
  const translate = new aws.Translate();

  const params = {
    Text: text,
    SourceLanguageCode: "en",
    TargetLanguageCode: targetLang,
  };

  try {
    const response = await translate.translateText(params).promise();
    const translatedText = response;

    if ((text === "sports" || text === "Sports") && targetLang === "hi") {
      return "खेल";
    } else if (text === "apple" || (text === "Apple" && targetLang === "hi")) {
      return "एप्पल";
    }

    return translatedText?.TranslatedText;
  } catch (error) {
    console.error("Error during translation:", error);
    throw new Error("Translation failed");
  }
}

// get all posts
async function getAllPosts(req, res) {
  const {
    lang = "en",
    location = "",
    page = 1,
    limit = 10,
    category = "All News",
  } = req.query;

  try {
    const filter = {
      "location.code": { $regex: new RegExp(location, "i") },
    };

    if (category !== "All News") {
      filter.tags = { $in: [category] };
      // Match any tag that matches the category
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 }) // Sort by the most recent posts first
      .limit(page * limit); // Fetch cumulative posts for all pages up to the current page

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found." });
    }

    const translatedPosts =
      lang === "en"
        ? posts
        : await Promise.all(
            posts.map(async (post) => {
              const translatedTitle = await translateText(post.title, lang);
              const translatedDescription = await translateText(
                post.description,
                lang
              );
              const translatedPostBy = await translateText(post.postBy, lang);
              const translatedLocation = await translateText(
                post.location.name || "India",
                lang
              );

              const translatedTags = await Promise.all(
                post.tags.map(async (tag) => {
                  if (tag === "apple") {
                    return tag;
                  }
                  return await translateText(tag, lang);
                })
              );

              return {
                ...post.toObject(),
                postBy: translatedPostBy,
                location: translatedLocation,
                title: translatedTitle,
                description: translatedDescription,
                tags: translatedTags,
              };
            })
          );

    return res.status(200).json(translatedPosts);
  } catch (error) {
    console.error("Error fetching or translating posts:", error);
    res.status(500).json({ error: "Failed to fetch or translate posts." });
  }
}

// Create a new post and send notification
async function createPost(req, res) {
  try {
    const newPost = await Post.create(req.body);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
}

// Update a post
async function updatePost(req, res) {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensures that validators are run on update
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
}

// Delete a post and its associated image
async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const imageURL = req.query.imageURL; // Get the image URL from the query params

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Validate Image URL/Key
    if (!imageURL) {
      return res.status(400).json({ error: "Image key is required." });
    }

    // Extract the key from the full URL if necessary
    const imageKey = imageURL.includes("amazonaws.com")
      ? imageURL.split("/").pop()
      : imageURL;

    const params = {
      Bucket: BUCKET_NAME,
      Key: imageKey, // the key of the image you want to delete
    };

    try {
      await s3.deleteObject(params).promise();
      console.log("Image deleted successfully.");
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error deleting image: " + error.message });
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
}

async function getPostsLength(req, res) {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && category !== "All News") {
      filter.tags = { $in: [category] };
    }

    const postsLength = await Post.countDocuments(filter);
    return res.status(200).json(postsLength);
  } catch (error) {
    console.error("Error fetching posts length:", error);
    res.status(500).json({ error: "Failed to fetch posts length" });
  }
}

async function getLocationPostsLength(req, res) {
  try {
    const { location } = req.query;
    // Extract `location` from query parameters
    if (!location) {
      return res.status(400).json({ error: "Location parameter is required" });
    }

    const filter = {
      "location.code": { $regex: new RegExp(location, "i") },
    };

    const postsLength = await Post.countDocuments(filter);
    return res.status(200).json(postsLength);
  } catch (error) {
    console.error("Error fetching posts length:", error.message);
    res.status(500).json({ error: "Failed to fetch posts length" });
  }
}

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPostsLength,
  getLocationPostsLength,
};

// async function translateText(text, targetLang) {
//   try {
//     const response = await axios({
//       method: 'POST',
//       url: process.env.RAPID_API_URL,
//       params: {
//         from: 'en',
//         to: targetLang,
//         query: text
//       },
//       headers: {
//         'x-rapidapi-key': process.env.RAPID_API_KEY,
//         'x-rapidapi-host': process.env.RAPID_API_HOST,
//       },
//       data: {
//         translate: 'rapidapi'
//       }
//     });

//     // const response = await axios({
//     //   method: "POST",
//     //   url: process.env.RAPID_API_URL,
//     //   headers: {
//     //     "X-RapidAPI-Key": process.env.RAPID_API_KEY,
//     //     "X-RapidAPI-Host": process.env.RAPID_API_HOST,
//     //   },
//     //   data: {
//     //     q: text,
//     //     source: 'en',
//     //     target: targetLang,
//     //     format: "text",
//     //   },
//     // });

//     const translatedText = response.data;

//     return translatedText?.translation;
//   } catch (error) {
//     console.error("Error during translation:", error);
//     throw new Error("Translation failed");
//   }
// }

// async function getAllPosts(req, res) {
//   const { lang = "en" } = req.query;

//   try {
//     const posts = await Post.find({});

//     if (lang === "en") {
//       return res.status(200).json(posts);
//       // Return posts as is if language is "en"
//     }

//     const translatedPosts = await Promise.all(
//       posts.slice(0, 1).map(async (post) => {
//         const translatedpostBy = await translateText(post.postBy, lang);
//         const translatedLocation = await translateText(post.location, lang);
//         const translatedTitle = await translateText(post.title, lang);
//         const translatedDescription = await translateText(post.description, lang);
//         // Handle translation of tags
//         const translatedTags = await Promise.all(
//           post.tags.map(async (tag) => {
//             const transTag = await translateText(tag, lang);
//             return transTag;
//           })
//         );
//         // const translatedTags = await Promise.all(
//         //   post.tags.map(async (tag) => {
//         //     const transTag = await translateText(tag, lang);
//         //     return transTag?s[0]?.translatedText || tag;
//         //   })
//         // );

//         const updatedPost = {
//           ...post.toObject(),
//           postBy: translatedpostBy,
//           location: translatedLocation,
//           title: translatedTitle,
//           description: translatedDescription,
//           // postBy: translatedpostBy?.translations[0]?.translatedText || post.postBy,
//           // location: translatedLocation?.translations[0]?.translatedText || post.location,
//           // title: translatedTitle?.translations[0]?.translatedText || post.title,
//           // description: translatedDescription?.translations[0]?.translatedText || post.description,
//           tags: translatedTags,
//         };

//         return updatedPost;
//       })
//     );

//     // Return translated posts
//     return res.status(200).json(translatedPosts);
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({ error: "Failed to fetch posts" });
//   }
// }
