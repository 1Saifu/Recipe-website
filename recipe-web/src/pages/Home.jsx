import React from "react";
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import Axios from "axios";
import Card from 'react-bootstrap/Card';

const Home = () => {

const [recipes, setRecipes] = useState([]);

useEffect(() => {
    fetchRecipes();
}, [])


const fetchRecipes = async () => {
    try {
        const token = localStorage.getItem("accessToken"); 
        const response = await Axios.get("http://localhost:8080/recipe", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Fetched recipes:", response.data);
        setRecipes(response.data);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
};


    return(
        <div>
            <h2 style={{ fontSize: '60px', fontWeight: '200' }}>Recipe Website</h2>
            <br />
            <div className="d-flex justify-content-around flex-wrap" >
            {recipes.map((recipe) => (
                <Card key={recipe._id} style={{ width: '18rem', margin: '0 10px 20px 10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 2)' }}>
                    <Card.Body>
                        <Card.Title style={{ fontFamily: 'Dancing Script', color:'#B8860B' }}>{recipe.title}</Card.Title>
                        <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px' }}> <strong>Ingredients:</strong> {recipe.ingredients.join(", ")} </Card.Text>
                        <Card.Text style={{ fontFamily: 'Dancing Script', fontSize: '16px' }}> <strong>Instructions:</strong> {recipe.instructions} </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
            <br />
             <Link to="/pages/Login"> 
             <button style={{ fontSize: '14px', padding: '6px 12px', width: '200px' }} className="button">Sign in</button> 
             </Link>
             <br />
             <br />
            <Link to="/pages/Register">
            <button style={{ fontSize: '14px', padding: '6px 12px', width: '200px' }} className="button">Register</button>
            </Link>
        </div>
    )
}

export default Home;