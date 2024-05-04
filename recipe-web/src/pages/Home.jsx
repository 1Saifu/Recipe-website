import React from "react";
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import Axios from "axios";
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

const Home = () => {

const [recipes, setRecipes] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [recipesPerPage] = useState(6);

useEffect(() => {
    fetchRecipes();
}, [])


const fetchRecipes = async () => {
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

    return (
        <div>
            <h2 style={{ fontSize: '60px', fontWeight: '200' }}>Recipe Website</h2>
            <br />
            <Link to="/pages/Login"> 
                <button style={{ fontSize: '14px', padding: '6px 12px', width: '200px',  }} className="button">Sign in</button> 
            </Link>
            <Link to="/pages/Register">
                <button style={{ fontSize: '14px', padding: '6px 12px', width: '200px' }} className="button">Register</button>
            </Link>
            <br />
            <br />
            <div className="d-flex justify-content-around flex-wrap" >
                {currentRecipes.map((recipe) => (
                    <Card key={recipe._id} style={{ width: '18rem', margin: '0 10px 20px 10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 2)' }}>
                         <div style={{ height: '200px', position: 'relative' }}>
                                <img src={recipe.imageUrl} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px 5px 0 0' }} />
                            </div>
                        <Card.Body>
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
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <br />
            <div className="d-flex justify-content-center">
                <Pagination>
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
            </div>
        </div>
    );
    
}

export default Home;