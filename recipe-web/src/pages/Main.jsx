import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, } from "react";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { imgDB } from '../firebase';
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useLocation, useNavigate } from "react-router-dom";
import "../style.css";

const Main = () => {

const [recipes, setRecipes] = useState([]);
const [title, setTitle] = useState("");
const [ingredients, setIngredients] = useState([]);
const [instructions, setInstructions] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [reviewText, setReviewText] = useState("");
const [showModal, setShowModal] = useState(false);
const [selectedRecipeId, setSelectedRecipeId] = useState(null);
const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedRecipeReviews, setSelectedRecipeReviews] = useState([]);
const navigate = useNavigate();
const { state } = useLocation();
const [currentPage, setCurrentPage] = useState(1);
const [recipesPerPage] = useState(3);
const [recipeImages, setRecipeImages] = useState({});

const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipeId(null);
    setTitle("");
    setIngredients([]);
    setInstructions("");
    setImageUrl("");
};
const handleShowModal = () => setShowModal(true);

useEffect(() => {
    fetchRecipe();
}, [])


const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/"); 
};

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

const lastRecipeIndex = currentPage * recipesPerPage;
const firstRecipeIndex = lastRecipeIndex - recipesPerPage;
const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

const totalPages = Math.ceil(recipes.length / recipesPerPage);

const paginate = (pageNumber) => setCurrentPage(pageNumber);


const createRecipe = async (imageUrl) => {
    const creatorId = state?.userId;
    try {
        const token = localStorage.getItem("accessToken"); 

        const ingredientsString = ingredients.toString();
        

        const response = await Axios.post("http://localhost:8080/recipe", {
            title,
            ingredients: ingredientsString,
            instructions,
            creatorId,
            imageUrl: imageUrl || ""
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

const handleUpdateClick = (recipeId, recipeTitle, recipeIngredients, recipeInstructions) => {
    setSelectedRecipeId(recipeId);
    setTitle(recipeTitle);
    setIngredients(recipeIngredients);
    setInstructions(recipeInstructions);
    setImageUrl(recipeImages[recipeId] || ""); 
    handleShowModal(false);
};


const handleImageChange = async (event, recipeId) => {
    console.log("Handling image change...");
    const file = event.target.files[0];

    const imageName = `${v4()}`;

    const storageRef = ref(imgDB, `imgs$/${imageName}`);

    try {

        await uploadBytes(storageRef, file);

        const imageUrl = await getDownloadURL(storageRef);
        console.log("Download URL:", imageUrl); 

        updateRecipe(recipeId, imageUrl);

    } catch (error) {
        console.error("Error uploading image:", error);
    }
};



const updateRecipe = async (recipeId, imageUrl) => {
    try {

    const token = localStorage.getItem("accessToken");
    const ingredientsString = ingredients.toString();

    const response = await Axios.put(`http://localhost:8080/recipe/${selectedRecipeId}`, {
        title,
        ingredients: ingredientsString,
        instructions,
        imageUrl: imageUrl || ""
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
        
    const updatedRecipe = response.data;
        
    setRecipes(prevRecipes =>
    prevRecipes.map(recipe =>
    recipe._id === recipeId ? updatedRecipe : recipe)); 
                
    console.log("Recipe after update:", response.data);

    handleCloseModal();

    } catch (error) {
        console.error("Error updating recipe:", error);
    }
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
    fetchRecipeReviews(recipeId); 
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


return (
    <div>
        <h2 style={{ fontSize: '60px', fontWeight: '200' }}>Recipes</h2>
        <Button variant="primary" style={{ fontSize: '14px', padding: '6px 12px', width: '200px' }} className="button2" onClick={handleLogout}>Logout</Button>
        <br />
        <br />
        <Button variant="primary" onClick={handleShowModal}>Create New Recipe</Button>
        <br />
        <br />
        <div className="d-flex justify-content-around flex-wrap">
            {currentRecipes.map((recipe) => (
                <Card key={recipe._id} style={{ width: '18rem', margin: '0 10px 20px 10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 2)' }}>
                    <Card.Body>
                        <Card.Title style={{ fontFamily: 'Dancing Script', color:'#B8860B' }}>{recipe.title}</Card.Title>   
                        {recipe.imageUrl && <img src={recipe.imageUrl} alt="Uploaded" style={{ maxHeight: '200px', maxWidth: '200px', objectFit: 'cover' }} />}
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
                                <Button variant="primary" className="customButton" onClick={() => handleShowReviewModal(recipe._id)}>Review</Button>
                            </div>
                        )}
                    </Card>
                ))}
        </div>

        <Pagination className="d-flex justify-content-center">
    {currentPage > 1 && (
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
    )}
    {Array.from({ length: totalPages }, (_, index) => (
        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
        </Pagination.Item>
    ))}
    {currentPage < totalPages && (
        <Pagination.Next onClick={() => paginate(currentPage + 1)} />
    )}
</Pagination>


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
                    <br />
                    <Button variant="primary" type="submit">Submit Review</Button>
                </Form>
            </Modal.Body>
        </Modal>

        <div>
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
                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={(event) => handleImageChange(event, selectedRecipeId)} />
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
);

}

export default Main;