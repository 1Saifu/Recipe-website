import React from "react";
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import Axios from "axios";
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

const Home = () => {

const [recipes, setRecipes] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [recipesPerPage] = useState(9);

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

    return(
        <div>
            <h2 style={{ fontSize: '60px', fontWeight: '200' }}>Recipe Website</h2>
            <br />
             <Link to="/pages/Login"> 
             <button style={{ fontSize: '14px', padding: '6px 12px', width: '200px' }} className="button">Sign in</button> 
             </Link>
             <br />
             <br />
            <Link to="/pages/Register">
            <button style={{ fontSize: '14px', padding: '6px 12px', width: '200px' }} className="button">Register</button>
            </Link>
            <br />
            <br />
            <div className="d-flex justify-content-around flex-wrap" >
            {currentRecipes.map((recipe) => (
                <Card key={recipe._id} style={{ width: '18rem', margin: '0 10px 20px 10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 2)' }}>
                    <Card.Body>
                        <Card.Title style={{ fontFamily: 'Dancing Script', color:'#B8860B' }}>{recipe.title}</Card.Title>
                        <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px' }}> <strong>Ingredients:</strong> {recipe.ingredients.join(", ")} </Card.Text>
                        <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px' }}> <strong>Instructions:</strong> {recipe.instructions} </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
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
    )
}

export default Home;