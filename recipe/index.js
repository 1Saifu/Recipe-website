require('dotenv').config();

const mongoose = require("mongoose");
const cors = require("cors");
const express = require('express');
const app = express();

const uri = process.env.MONGODB_URI;

const { registerUser, loginUser } = require("./controllers/creator.controller");
const { 
    getAllRecipes, 
    getRecipeById, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe, 
    favoriteRecipe, 
    createReview } = require("../recipe/controllers/recipe.controller");

const User = require("../recipe/models/user");
const Recipe = require("../recipe/models/recipe");

const creatorRouter = require('./routes/creator.route');
const recipeRouter = require('./routes/recipe.route');

app.use(express.json());
app.use(cors());

app.use("/creator", creatorRouter);
app.use("/recipe", recipeRouter);


async function connectToDatabase() {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
  
  connectToDatabase();

