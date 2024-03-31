const Express = require('express');

const {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    favoriteRecipe,
    createReview
} = require('../controllers/recipe.controller');

const recipeRouter = Express.Router();

recipeRouter.get('/', getAllRecipes);
recipeRouter.get('/:id', getRecipeById);
recipeRouter.post('/', createRecipe);
recipeRouter.put('/:id', updateRecipe);
recipeRouter.delete('/:id', deleteRecipe);
recipeRouter.pst('/:id/favorite', favoriteRecipe);
recipeRouter.post('/:id/reviews', createReview);

module.exports = recipeRouter;