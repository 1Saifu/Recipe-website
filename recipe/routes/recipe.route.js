const Express = require('express');

const {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    favoriteRecipe,
    createReview,
    getRecipeReviews
} = require('../controllers/recipe.controller');
const authMiddleware = require('../middleware/creator.middleware');

const recipeRouter = Express.Router();

recipeRouter.get('/', authMiddleware, getAllRecipes);
recipeRouter.get('/:id', authMiddleware, getRecipeById);
recipeRouter.post('/', authMiddleware, createRecipe);
recipeRouter.put('/:id', authMiddleware, updateRecipe);
recipeRouter.delete('/:id', authMiddleware, deleteRecipe);
recipeRouter.post('/:id/favorite', authMiddleware, favoriteRecipe);
recipeRouter.post('/:id/reviews', authMiddleware, createReview);
recipeRouter.get('/:id/reviews', authMiddleware, getRecipeReviews);

module.exports = recipeRouter;