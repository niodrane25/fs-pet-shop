import process from "node:process";
import fs from "node:fs";

let age = process.argv[3];
let name = process.argv[4];
let type = process.argv[5];
const subcommand = process.argv[2];

if (subcommand === "read") {
  const petIndex = process.argv[3];
  fs.readFile("pets.json", "utf8", (error, string) => {
    if (error) {
      throw error;
    }

    const pets = JSON.parse(string);
    if (petIndex === undefined) {
      console.log(pets);
    } else {
      console.log(pets[petIndex]);
    }
  });
} else if (subcommand === "create") {
  // Do create stuff
  if (Number.isNaN(age) || type === undefined || name === undefined) {
    console.error("Usage: node pets.js create AGE NAME TYPE")
    process.exit(1);
  } 
  const newPet = {age, name, type};
  fs.readFile("pets.json", "utf-8", (error, string) => {
    if (error) {
      throw error;
    }
    let pets = JSON.parse(string);
    pets.push(newPet);
    console.log(pets);
    fs.writeFile("pets.json", JSON.stringify(pets), (error) => {
      if(error) {
        throw error;
      }
    })
  }) 

} else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}