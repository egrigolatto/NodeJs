import { readFileSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import chalk from "chalk";


const tareas = []; //tareas por hacer
const DB_FILE = "task.text";

// process- contiene el hilo de procesos de node
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// para mostrar opciones de menu
const displayMenu = () => {
  console.log(chalk.yellow.bold("To Do App"));
  console.log(chalk.blueBright("Menu de Opciones:"));
  console.log("1. Agregar tarea");
  console.log("2. Listar tareas");
  console.log("3. Completar tarea");
  console.log("4. Salir");
  console.log("\n");
}

const cargarTareas = () => {
   try {
     const data = readFileSync(DB_FILE, "utf-8");
     const lineas = data.split("\n");
     tareas.length = 0;

     lineas.forEach(line => {
       if (line.trim() !== "") {
         const { tarea, completada } = line.split("|");
         tareas.push({ tarea, completada: completada == true })
       }
     });
     console.log(chalk.green.bold("Tareas cargadas\n"));
   } catch (error) {
    console.log(chalk.green.bold("No hay tareas por hacer\n"));
   }
}

const guardarTarea = () => {
  const data = tareas.map(tarea => `${tarea.tarea} | ${tarea.completada}`).join("\n");
  writeFileSync(DB_FILE, data, "utf-8");
  console.log(chalk.green.bold("Tarea agregada a la DB \n"));
}

const agregarTarea = () => {
  rl.question(chalk.bgMagentaBright("Escribe la tarea: "), (tarea) => {
    tareas.push({ tarea, completada: false });
    console.log(chalk.green.bold("Tarea agregada\n"));

    guardarTarea();
    displayMenu();
    elegirOpcion();
  })
}

const listarTareas = () => {
  console.log(chalk.yellow.bold("\nTareas por hacer\n"));


  if (tareas.length === 0) {
    console.log(chalk.green.bold("No hay tareas por hacer\n"));
  } else {
    tareas.forEach((tarea, index) => {
      let estado = tarea.completada ? "✅" : "❌";

      if (tarea.completada) {
        console.log(
        chalk.greenBright(`${index + 1}. ${estado} - ${tarea.tarea}`)
        );
      } else {
        console.log(
          chalk.redBright(`${index + 1}. ${estado} - ${tarea.tarea}`)
        );
      }
      
    })
  }

  displayMenu();
  elegirOpcion();
}

const completarTarea = () =>{
  rl.question(
    chalk.bgMagentaBright("Digita el número de la tarea a completar: "),
    (nroTarea) => {
      const index = parseInt(nroTarea) - 1;
      if (index >= 0 && index < tareas.length) {
        tareas[index].completada = true;
        guardarTarea();
        console.log(chalk.green.bold("Tarea completada con exito ✅\n"));
      } else {
        console.log(chalk.red.bold("Número de tarea inválido \n"));
      }
      displayMenu();
      elegirOpcion();
    }
  );
}


const elegirOpcion = () => {
  rl.question("Elige una opcion:", (opcion) => {
    switch (opcion) {
      case "1":
        agregarTarea(); 
        break;
      case "2":
        listarTareas();
        break;
      case "3":
        completarTarea();
        break;
      case "4":
        4;
        console.log(chalk.yellow("Adiós"));
        rl.close();
        break;
      default:
        console.log(chalk.red("Opción Inválida, Intenta nuevamente \n"));
        displayMenu();
        elegirOpcion(); // funcion recursiva
        break;
    }
  })
}

cargarTareas();
displayMenu();
elegirOpcion();