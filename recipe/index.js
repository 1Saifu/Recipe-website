require('dotenv').config();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const app = require("../mongoose_server/server");

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log("MongoDB URI:", uri);

const creatorRouter = require('./routes/creator.route');
const recipeRouter = require('./routes/recipe.route');

app.use("/creator", creatorRouter);
app.use("/recipe", recipeRouter);


async function connectToDatabase() {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
  
  connectToDatabase();

