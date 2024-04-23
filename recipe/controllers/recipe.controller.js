const Recipe = require('../models/recipe')
const Review = require('../models/review');

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
    const { title, ingredients, instructions } = req.body;
    const creatorId = req.userId;

    let ingredientsArray;
    if (typeof ingredients === 'string') {
        ingredientsArray = ingredients.split(",");
    } else {
        return res.status(400).json({ error: 'Ingredients must be a string' });
    }

    try {
        const recipe = await Recipe.create({ title, ingredients: ingredientsArray, instructions, creator: creatorId });
        console.log("Recipe created:", recipe);
        res.status(201).json(recipe);
    } catch(error) {
        console.error("Error creating recipe:", error);
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
    const { id } = req.params;
    const userId = req.user._id;

    try{
        const recipe = await Recipe.findById(id);
        if(!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const isFavorited = recipe.favorites.includes(userId);
        if (isFavorited) {
            return res.status(400).json({ error: 'Recipe already favorited' });
        }

        recipe.favorites.push(userId);
        await recipe.save();

        res.json({ message: 'Recipe favorited successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createReview(req, res) {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    try{
        const recipe = await Recipe.findById(id);
        if(!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const review = new Review({
            recipe: id,
            user: userId,
            text: text
        });

        await review.save();
        res.status(201).json(review);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    favoriteRecipe,
    createReview
};


