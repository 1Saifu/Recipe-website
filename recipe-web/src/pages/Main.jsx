import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLocation } from "react-router-dom";

const Main = () => {

const [recipes, setRecipes] = useState([]);
const [title, setTitle] = useState("");
const [ingredients, setIngredients] = useState([]);
const [instructions, setInstructions] = useState("");
const [showModal, setShowModal] = useState(false);
const { state } = useLocation();

const handleCloseModal = () => setShowModal(false);
const handleShowModal = () => setShowModal(true);

useEffect(() => {
    fetchRecipe();
}, [])

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
    try{

        console.log("Title:", title);
        console.log("Ingredients:", ingredients);
        console.log("Instructions:", instructions);
        console.log("creatorID:", creatorId);

        const response = await Axios.post("http://localhost:8080/recipe", {
            title,
            ingredients: ingredients.split(","),
            instructions,
            creatorId
        })
        console.log("Recipe created:", response.data);
        const newRecipe = response.data;
        setRecipes([...recipes, newRecipe]);
        setTitle(""); 
        setIngredients([]);
        setInstructions("");
    }
    catch(error){
        console.error("Error creating recipes:", error);
    }
}

const updateRecipe = async (id) => {
    try{
        const response = await Axios.put(`http://localhost:8080/recipe/{id}`, {
            title,
            ingredients: ingredients.split(","),
            instructions,
        })
        const updatedRecipes = recipes.map(recipe => {
            if(recipe._id === id){
                return response.data
            }
            return recipe;
        })
        setRecipes(updatedRecipes)
    }
    catch(error){
        console.error("Error updating recipes:", error);
    }
}

const deleteRecipe = async (id) => {
    try{
        await Axios.delete(`http://localhost:8080/recipe/${id}`);
        const filteredRecipes = recipes.filter(recipe => recipe._id !== id);
        setRecipes(filteredRecipes);
    }
    catch(error){
        console.error("Error deleting recipes:", error);
    }
}

    return(
        <div>
        <h2>Recipes</h2>
        <div className="d-flex justify-content-around flex-wrap">
            {recipes.map((recipe) => (
                <Card key={recipe._id} style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{recipe.title}</Card.Title>
                        <Card.Text>{recipe.ingredients}</Card.Text>
                        <Card.Text>{recipe.instructions}</Card.Text>
                    </Card.Body>
                    <Button onClick={() => updateRecipe(recipe._id)}>Update</Button>
                    <Button onClick={() => deleteRecipe(recipe._id)}>Delete</Button>
                </Card>
            ))}
        </div>
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
                        <Button variant="primary" onClick={createRecipe}>Create Recipe</Button>
                    </Modal.Footer>
                </Modal>
        </div>
        </div>
    )
}

export default Main;