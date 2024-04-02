const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("../recipe/models/user");
const Recipe = require("../recipe/models/recipe");

const { registerUser, loginUser } = require("../recipe/controllers/creator.controller");
const { 
    getAllRecipes, 
    getRecipeById, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe, 
    favoriteRecipe, 
    createReview } = require("../recipe/controllers/recipe.controller");

const creatorRouter = require('../recipe/routes/creator.route');
const recipeRouter = require('../recipe/routes/recipe.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [`http://localhost:3000`, `http://127.0.0.1:3000`]
}))


app.use("/creator", creatorRouter);
app.use("/recipe", recipeRouter);

const uri = "mongodb://127.0.0.1:27017/recipe";

mongoose.connect(uri)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});