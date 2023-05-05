import fs, { appendFile } from "node:fs";
import express from "express"

const app = express();
app.use(express.json());

app.get("/pets", (req, res) => {
    fs.readFile("pets.json", "utf-8", (err, str) => {
        if(err) {
            res.statusCode = 500;
            res.end();
            return;
        }
        const pets = JSON.parse(str);
        res.setHeader("Content-Type", "application/json")
        res.write(JSON.stringify(pets));
        res.end();
    });
});

app.get("/pets/:index", (req, res) => {
    const index = parseInt(req.params.index);
    fs.readFile("pets.json", "utf-8", (err, str) => {
        if (err) {
            res.statusCode = 500;
            res.end();
            return;
        }
        const pets = JSON.parse(str);
        if(isNaN(index) || index < 0 || index >= pets.length) {
            res.statusCode = 404;
            res.end("Not Found");
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(pets[index]));
        res.end();
    });
});

app.post("/pets", (req, res) => {
    const newPet = req.body;
    if (!newPet || !newPet.name || !newPet.type || !newPet.age) {
        res.status(400).send("incorrect pet data");
        return;
    }
    fs.readFile("pets.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading pets file");
            return;
        }
        const pets = JSON.parse(data);
        pets.push(newPet);

        fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
            if (err) {
                res.status(500).send("Error writing pets file");
                return;
            }

            res.status(202).send("Pet added successfully");
        });
    });
});

app.delete("/pets/:index", (req, res) => {
    const index = parseInt(req.params.index);
    fs.readFile("pets.json", "utf-8", (err, data) => {
      if (err) {
        res.status(500).send("Error reading pets file");
        return;
      }
      const pets = JSON.parse(data);
      if (isNaN(index) || index < 0 || index >= pets.length) {
        res.status(404).send("Not Found");
        return;
      }
      pets.splice(index, 1);
      fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
        if (err) {
          res.status(500).send("Error writing pets file");
          return;
        }
        res.status(200).send("Pet deleted successfully");
      });
    });
  });

app.listen(3001, function () {
    console.log("server is running");
});