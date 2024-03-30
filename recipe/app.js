const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/recipe";

function run() {

mongoose.connect(uri)
.then(() => {
    console.log("Connected to MongoDB")

    mongoose.disconnect()
    .then(() => {
        console.log("Disconnected from MongoDB")
    })
    .catch((error) => {
        console.error("Error disconnecting from MongoDB:", error);
    })
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
})
};

run();