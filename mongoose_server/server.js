const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [`http://localhost:3000`, `http://127.0.0.1:3000`,]
}))

const PORT = process.env.PORT || 8080;
app.listen(() => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server is running`)
});

module.exports = app;