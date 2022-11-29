import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
   res.send("server up and running");
});

app.listen(PORT, () => console.log(`app escuchando en el puerto ${PORT}`));
