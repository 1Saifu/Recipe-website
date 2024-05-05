import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, } from "react";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import ToggleButton from 'react-bootstrap/ToggleButton';
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
const [likes, setLikes] = useState({});
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [recipeToDelete, setRecipeToDelete] = useState(null);
const navigate = useNavigate();
const { state } = useLocation();
const [currentPage, setCurrentPage] = useState(1);
const [recipesPerPage] = useState(6);


const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipeId(null);
    setTitle("");
    setIngredients([]);
    setInstructions("");
    setImageUrl("");
};
const handleShowModal = () => setShowModal(true);

const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setRecipeToDelete(null);
};

const handleShowDeleteModal = (recipeId) => {
    setRecipeToDelete(recipeId);
    setShowDeleteModal(true);
};

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
        try {
            const token = localStorage.getItem("accessToken");
    
            const response = await Axios.get("http://localhost:8080/recipe", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            setRecipes(response.data);
    
            const likesInfo = {};
            response.data.forEach(recipe => {
                likesInfo[recipe._id] = recipe.favorites.length;
            });
    
            setLikes(likesInfo);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }
    

const lastRecipeIndex = currentPage * recipesPerPage;
const firstRecipeIndex = lastRecipeIndex - recipesPerPage;
const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

const totalPages = Math.ceil(recipes.length / recipesPerPage);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

//Function om image
const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);

    if (!file) {
        console.error("No file selected.");
        return;
    }

    const imageName = `${v4()}`;
    const storageRef = ref(imgDB, `imgs$/${imageName}`);

    try {
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        console.log("Download URL:", imageUrl);

        setImageUrl(imageUrl)

        updateRecipe(selectedRecipeId, imageUrl);
        
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};


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

        console.log("Creating data:", response.data);
        console.log("ImageUrl from response:", response.data.imageUrl);

        setRecipes(prevRecipes => [...prevRecipes, response.data]); 
        fetchRecipe();
        setTitle(""); 
        setIngredients([]);
        setInstructions("");
        setImageUrl(""); 
        setShowModal(false);
    } catch (error) {
        console.error("Error creating recipes:", error);
    }
};

const updateRecipe = async (selectedRecipeId, imageUrl) => {
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
    recipe._id === selectedRecipeId ? updatedRecipe : recipe)); 
                
    console.log("Recipe after update:", response.data);

    handleCloseModal();

    } catch (error) {
        console.error("Error updating recipe:", error);
    }
};

//När man trycker på update knappen
const handleUpdateClick = (recipe) => {
    setSelectedRecipeId(recipe._id);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    setImageUrl(recipe.imageUrl); 
    handleShowModal();
};


const deleteRecipe = async (id) => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await Axios.delete(`http://localhost:8080/recipe/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
    } catch (error) {
        console.error("Error deleting recipe:", error);
    }
};


const fetchRecipeReviews = async (recipeId) => {
    try {
        const response = await Axios.get(`http://localhost:8080/recipe/${recipeId}/reviews`);

        setSelectedRecipeReviews(response.data);
        console.log(response.data)

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

const handleLikeClick = async (recipeId) => {
    if (state?.userId === recipes.find(recipe => recipe._id === recipeId)?.creator) {
        console.log("Owner cannot like their own recipe.");
        return; 
    }

    try {
        const token = localStorage.getItem("accessToken");

        const response = await Axios.post(`http://localhost:8080/recipe/${recipeId}/favorite`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Response data:", response.data);

        setLikes(prevLikes => ({
            ...prevLikes,
            [recipeId]: (prevLikes[recipeId] || 0) + 1
        }));

    } catch (error) {
        console.error("Error liking recipe:", error);
    }
};


const handleUnlikeClick = async (recipeId) => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await Axios.delete(`http://localhost:8080/recipe/${recipeId}/unfavorite`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Response data:", response.data);

        setLikes(prevLikes => ({
            ...prevLikes,
            [recipeId]: Math.max((prevLikes[recipeId] || 0) - 1, 0)
        }));

    } catch (error) {
        console.error("Error unliking recipe:", error);
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
                <Card key={recipe._id} style={{ width: '20rem', margin: '0 10px 20px 10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' }}>
                    <div style={{ height: '200px', position: 'relative' }}>
                        <img src={recipe.imageUrl} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px 5px 0 0' }} />
                    </div>
                    <div style={{ padding: '10px' }}>
                        <div>
                            <Card.Title style={{ fontFamily: 'Dancing Script', marginBottom: '15px', fontSize: '20px' }}>{recipe.title}</Card.Title>
                        </div>
                        <div>
                            <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px', marginBottom: '5px' }}> <strong>Ingredients:</strong> {recipe.ingredients.join(", ")} </Card.Text>
                        </div>
                        <div>
                            <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px', marginBottom: '5px' }}> <strong>Instructions:</strong> {recipe.instructions} </Card.Text>
                        </div>
                        <div>
                            <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px', marginBottom: '5px' }}> <strong>Created by:</strong> {recipe.creator.username} </Card.Text>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px 10px 10px' }}>
                            {state && state.userId === recipe.creator._id && (
                            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                                <Button className="text-link" style={{ marginRight: '10px' }} onClick={() => handleUpdateClick(recipe)}>Update</Button>
                                <Button className="text-link" onClick={() => handleShowDeleteModal(recipe._id)}>Delete</Button>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px 10px 10px' }}>
                            <Button variant="primary" className="customButton" onClick={() => handleShowReviewModal(recipe._id)}>Review</Button>
                        {state?.userId !== recipe.creator._id && ( 
                            <div style={{ marginLeft: '10px' }}>
                                <ToggleButton
                                    id={`toggle-like-${recipe._id}`}
                                    type="checkbox"
                                    className="like-button" 
                                    variant={likes[recipe._id] ? "primary" : "outline-primary"}
                                    checked={likes && likes[recipe._id]} 
                                    onChange={() => {
                                        if (likes[recipe._id]) {
                                            handleUnlikeClick(recipe._id);
                                        } else {
                                            handleLikeClick(recipe._id);
                                        }
                                    }}
                                >
                                    {likes[recipe._id] ? `Unlike ${likes[recipe._id]}` : `Like ${likes[recipe._id]}`}
                                </ToggleButton>
                            </div>
                        )}
                        </div>
                    </div>
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
                    {!selectedRecipeId && (
                        <Button variant="primary" onClick={() => createRecipe(imageUrl)}>
                            Create Recipe
                        </Button>
                    )}
                    {selectedRecipeId && (
                        <Button variant="primary" onClick={() => updateRecipe(selectedRecipeId, imageUrl)}>
                            Update Recipe
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this recipe?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => {
                        deleteRecipe(recipeToDelete);
                        handleCloseDeleteModal();
                    }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
);
}

export default Main;