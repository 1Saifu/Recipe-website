const app = require("../mongoose_server/server");
const mongoose = require("mongoose");

const uri = "mongodb+srv://saifukhan:Saifuvby1944@cluster-recipe.jd0lilx.mongodb.net/recipe-web?retryWrites=true&w=majority&appName=Cluster-recipe"

const { registerUser, loginUser } = require("../recipe/controllers/creator.controller");
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

const creatorRouter = require('../recipe/routes/creator.route');
const recipeRouter = require('../recipe/routes/recipe.route');

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