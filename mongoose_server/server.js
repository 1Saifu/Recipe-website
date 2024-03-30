const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [`http://localhost:3000`, `http://127.0.0.1:3000`]
}))

app.listen(8080, () => {
    console.log("Server running on: 8080")
})