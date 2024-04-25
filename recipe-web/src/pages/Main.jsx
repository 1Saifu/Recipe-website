import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLocation } from "react-router-dom";
import "../style.css";

const Main = () => {

const [recipes, setRecipes] = useState([]);
const [title, setTitle] = useState("");
const [ingredients, setIngredients] = useState([]);
const [instructions, setInstructions] = useState("");
const [reviewText, setReviewText] = useState("");
const [showModal, setShowModal] = useState(false);
const [selectedRecipeId, setSelectedRecipeId] = useState(null);
const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedRecipeReviews, setSelectedRecipeReviews] = useState([]);
const { state } = useLocation();

const handleCloseModal = () => setShowModal(false);
const handleShowModal = () => setShowModal(true);

useEffect(() => {
    fetchRecipe();
}, [])

useEffect(() => {
    if (state?.updatedRecipe) {
        setRecipes(prevRecipes => prevRecipes.map(recipe =>
            recipe._id === state.updatedRecipe._id ? state.updatedRecipe : recipe
        ));
    }
    if (state?.deletedRecipeId) {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== state.deletedRecipeId));
    }
}, [state]);

const fetchRecipe = async () => {
    try{
        const response = await Axios.get("http://localhost:8080/recipe")
        setRecipes(response.data)
    }
    catch(error){
        console.error("Error fetching recipes:", error);
    }
}

const createRecipe = async () => {
    const creatorId = state?.userId;
    console.log("Creating recipe...");
    try {
        console.log("Title:", title);
        console.log("Ingredients:", ingredients);
        console.log("Instructions:", instructions);
        console.log("creatorID:", creatorId);

        const token = localStorage.getItem("accessToken"); 

        const ingredientsString = ingredients.toString();

        const response = await Axios.post("http://localhost:8080/recipe", {
            title,
            ingredients: ingredientsString,
            instructions,
            creatorId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Recipe created:", response.data);
        setRecipes(prevRecipes => [...prevRecipes, response.data]); 
        setTitle(""); 
        setIngredients([]);
        setInstructions("");
        setShowModal(false);
    } catch (error) {
        console.error("Error creating recipes:", error);
    }
};


const updateRecipe = async () => {
    try {
        const response = await Axios.put(`http://localhost:8080/recipe/${selectedRecipeId}`, {
            title,
            ingredients,
            instructions,
        });
        setRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe._id === selectedRecipeId ? response.data : recipe
            )
        ); 
        handleCloseModal(); 
    } catch (error) {
        console.error("Error updating recipe:", error);
    }
};

const handleUpdateClick = (recipeId, recipeTitle, recipeIngredients, recipeInstructions) => {
    setSelectedRecipeId(recipeId);
    setTitle(recipeTitle);
    setIngredients(recipeIngredients);
    setInstructions(recipeInstructions);
    handleShowModal();
};

const deleteRecipe = async (id) => {
    try{
        await Axios.delete(`http://localhost:8080/recipe/${id}`);
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
    }
    catch(error){
        console.error("Error deleting recipes:", error);
    }
}

const fetchRecipeReviews = async (recipeId) => {
    try {
        const response = await Axios.get(`http://localhost:8080/recipe/${recipeId}/reviews`);

        setSelectedRecipeReviews(response.data);

        setShowReviewModal(true);
    } catch (error) {
        console.error("Error fetching recipe reviews:", error);
    }
};

const handleShowReviewModal = (recipeId) => {
    setSelectedRecipeId(recipeId);
    fetchRecipeReviews(recipeId); // Fetch reviews for the selected recipe
    setShowReviewModal(true);
};

const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRecipeId(null);
    setSelectedRecipeReviews([]);
};

const handleReviewSubmit = async (recipeId) => {
    try {
        console.log("Submitting review...");

        const token = localStorage.getItem("accessToken");

        const response = await Axios.post(`http://localhost:8080/recipe/${recipeId}/reviews`, {
            text: reviewText
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setSelectedRecipeReviews(prevReviews => [...prevReviews, response.data]);

        setReviewText(""); 
        await fetchRecipeReviews(recipeId);
    } catch (error) {
        console.error("Error creating review:", error);
    }
};


    return(
        <div>
        <h2 style={{ fontSize: '60px', fontWeight: '200' }}>Recipes</h2>
        <br />
        <div className="d-flex justify-content-around flex-wrap" >
            {recipes.map((recipe) => (
                <Card key={recipe._id} style={{ width: '18rem', margin: '0 10px 20px 10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 2)' }}>
                    <Card.Body>
                        <Card.Title style={{ fontFamily: 'Dancing Script', color:'#B8860B' }}>{recipe.title}</Card.Title>
                        <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px' }}> <strong>Ingredients:</strong> {recipe.ingredients.join(", ")} </Card.Text>
                        <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px' }}> <strong>Instructions:</strong> {recipe.instructions} </Card.Text>
                    </Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 15px 10px 15px' }}>
                    {state?.userId === recipe.creator &&
                        <>
                        <Button className="customButton" onClick={() => handleUpdateClick(recipe._id, recipe.title, recipe.ingredients, recipe.instructions)}>Update</Button>
                        <Button className="customButton" onClick={() => deleteRecipe(recipe._id)}>Delete</Button>
                        </>
                    }
                    </div>
                    
                    {state?.userId && (
                            <div style={{ padding: '0 15px 10px 15px' }}>
                                <Button variant="primary" onClick={() => handleShowReviewModal(recipe._id)}>Review</Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <Modal show={showReviewModal} onHide={handleCloseReviewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {selectedRecipeReviews.map(review => (
                            <div key={review._id}>
                                <p><strong>{review.user.username}</strong>: {review.text}</p>
                            </div>
                        ))}
                    </div>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleReviewSubmit(selectedRecipeId);
                    }}>
                        <Form.Group controlId={`formReview-${selectedRecipeId}`}>
                            <Form.Label>Write a review</Form.Label>
                            <Form.Control
                                type="text"
                                value={reviewText}
                                onChange={(e) => {
                                    setReviewText(e.target.value);
                                }}
                                placeholder="Enter your review"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit Review</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <div>
        <Button variant="primary" onClick={handleShowModal}>Create New Recipe</Button>
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Recipe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
                            </Form.Group>
                            <Form.Group controlId="formIngredients">
                                <Form.Label>Ingredients</Form.Label>
                                <Form.Control type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Enter ingredients (comma separated)" />
                            </Form.Group>
                            <Form.Group controlId="formInstructions">
                                <Form.Label>Instructions</Form.Label>
                                <Form.Control as="textarea" rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Enter instructions" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={selectedRecipeId ? updateRecipe : createRecipe}>
                        {selectedRecipeId ? "Update Recipe" : "Create Recipe"}
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
        </div>
    )
}

export default Main;