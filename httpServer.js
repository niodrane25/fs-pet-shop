import http, { request } from "node:http";
import fs from "node:fs";
import { parse } from "node:path";

//create a server object:
http.createServer(function (req, res) {
    if (req.method === "GET" && req.url === "/pets") {
        fs.readFile("pets.json", "utf-8", (error, string) => { 
            if (error) {
                res.statusCode = 500;
                res.end();
                return;
            }
            const pets = JSON.parse(string);
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(pets));
            res.end();
        })
    } else if (req.method === "GET" && req.url.startsWith("/pets/")) {
      const urlParts = req.url.split('/');
      const index = parseInt(urlParts[urlParts.length - 1]);

      //read pets file and return results
      fs.readFile("pets.json", "utf-8", (error, string) => {
        if (error) {
          res.statusCode = 500;
          res.end();
          return;
        }
        const pets = JSON.parse(string);

        //check if index is valid
        if (isNaN(index) || index < 0 || index >= pets.length) {
          res.statusCode = 404;
          res.end("Not Found");
          return;
        }

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(pets[index]));
        res.end();
      });
    } 
  }).listen();