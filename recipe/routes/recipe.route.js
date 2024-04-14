const Express = require('express');
const { authMiddleware } = require('../middleware/creator.middleware')

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
recipeRouter.post('/', authMiddleware, createRecipe);
recipeRouter.put('/:id', authMiddleware, updateRecipe);
recipeRouter.delete('/:id', authMiddleware, deleteRecipe);
recipeRouter.post('/:id/favorite', authMiddleware, favoriteRecipe);
recipeRouter.post('/:id/reviews', authMiddleware, createReview);

module.exports = recipeRouter;