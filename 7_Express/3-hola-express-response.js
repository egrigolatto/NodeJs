import express from "express";
import { resolve } from "path";

const app = express();

app.get("/", (req, res) => {
  res.set({ "content-type": "text/html; charset=utf-8" });
  
  //res.send("<h1>Hola mundo desde Express.js con el método send</h1>");
  res.end("<h1>Hola mundo desde Express.js con el método end</h1>");
  // la diferencia entre end y send es que end es para finalizar el proceso de la peticion
});

app.get("/json", (req, res) => {
  res.json({
    name: "Ema ",
    age: 30,
    LinkedIn: "emanuelgrigolatto",
  });
});

app.get("/archivo", (req, res) => {
  res.sendFile(resolve("index.html"));
});

app.get("/plantilla", (req, res) => {
  //No funciona esta ruta porque hay que especificar el motor de plantillas a express.js
  res.render("plantilla");
});

app.get("/emanuelgrigolatto", (req, res) => {
  //res.send("<h1>Bienvenidos a emanuel grigolatto</h1>");
  res.redirect(301, "https://www.linkedin.com/in/emanuelgrigolatto/");
});

app.listen(3000, () =>
  console.log("Iniciando Express desde http://localhost:3000")
);
