import express from "express";
import fs from "fs/promises";
import path from "path";
import markdownIt from "markdown-it";
import fm from "front-matter";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("views", path.join(__dirname, "pages"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

// Rutas dinámicas desde archivos en la carpeta "pages"
const pagesDir = path.join(__dirname, "pages"); // en esta ruta defino los archivos que no tienen la extencion .pug, ya que esos los lee automaticamente el generador de plantillas
const files = await fs.readdir(pagesDir); // con estos esperamos a que lea lo que viene en esa ruta del directorio. el await en las ultimas versiones de ECMscript ya se puede usar de manera implicita, sin la necesidad de un asyinc dentro de una funcion

// Aquí lógica para archivos html y md
for (let file of files) {
  const filePath = path.join(pagesDir, file);
  let extname = path.extname(file);

  console.log(file, filePath, extname);

  if (extname === ".md" || extname === ".pug" || extname === ".html") {
    let fileName = path.basename(file, extname);
    console.log(fileName);

    app.get(`/${fileName}`, async (req, res) => {
      try {
        if (extname === ".pug") {
          res.render(fileName);
        }

        if (extname === ".html") {
          res.sendFile(filePath);
        }

        if (extname === ".md") {
          let fileContent = await fs.readFile(filePath, "utf-8");
          let { attributes: frontMatterAttributes, body } = fm(fileContent);

          let attributes = frontMatterAttributes;
          let contentHTML = markdownIt().render(body);
          res.render("layout-markdown", { ...attributes, contentHTML });
        }
      } catch (err) {
        res.status(404).render("error-404");
      }
    });
  }
}

//Ruta de la página principal
app.get("/", (req, res) => {
  res.render("index");
});

//Ruta del error 404
app.use((req, res) => {
  res.status(404).render("error-404");
});

app.listen(port, () =>
  console.log(`Sitio web corriendo en http://localhost:${port}`)
);
