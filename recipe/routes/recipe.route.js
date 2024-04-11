const Express = require('express');
const { authenticateUser } = require('../middleware/creator.middleware')

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
recipeRouter.post('/', authenticateUser, createRecipe);
recipeRouter.put('/:id', authenticateUser, updateRecipe);
recipeRouter.delete('/:id', authenticateUser, deleteRecipe);
recipeRouter.post('/:id/favorite', authenticateUser, favoriteRecipe);
recipeRouter.post('/:id/reviews', authenticateUser, createReview);

module.exports = recipeRouter;