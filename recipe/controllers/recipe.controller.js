const Recipe = require('../models/recipe')

async function getAllRecipes(req, res) {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getRecipeById(req, res) {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id);
        if(!recipe) {
            res.status(404).json({ error: 'Recipe not found' })
        }
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createRecipe(req, res) {
    const { title, ingredients, instructions }= req.body;
    const creatorId = req.user._id;
    try {
        const recipe = await Recipe.create({ title, ingredients, instructions, creator: creatorId });
        res.status(201).json(recipe)
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateRecipe(req, res) {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, { title, ingredients, instructions }, { new: true });
        if(!updatedRecipe) {
            res.status(404).json({ error: 'Recipe not found' })
        }
        res.json(updatedRecipe);
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteRecipe(req, res) {
    const { id } = req.params;
    try {
        const deleteRecipe = await Recipe.findByIdAndDelete(id);
        if(!deleteRecipe) {
            res.status(404).json({ error: 'Recipe not found' })
        }
        res.json({ message: 'Recipe successfully deleted' })
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function favoriteRecipe(req, res) {
    
}

async function createReview(req, res) {
    
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    favoriteRecipe,
    createReview
}