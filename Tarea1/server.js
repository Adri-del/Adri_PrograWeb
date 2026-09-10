const express = require("express");

const app = express();

app.use(express.static("."));

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});