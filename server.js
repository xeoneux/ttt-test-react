const fs = require("fs");
const http = require("http");
const path = require("path");

const url = "http://terriblytinytales.com/test.txt";

const fetchText = url =>
  new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = "";
      res.on("end", () => resolve(data));
      res.on("data", chunk => (data += chunk));
      res.on("error", err => reject(err));
    });
  });

const populateKeys = text => {
  let data = {};
  const words = /\w+/gi;
  const result = text.match(words);
  const normalized = result.map(word => word.toLowerCase());

  normalized.forEach(word => {
    if (data[word]) data[word]++;
    else data[word] = 1;
  });

  return data;
};

const startNodeServer = async data => {
  const port = process.env.PORT || 8080;
  http
    .createServer((req, res) => {
      let filePath = "./build" + req.url;
      if (req.url === "/") filePath = "./build/index.html";

      const mimeTypes = {
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".html": "text/html",
        ".js": "text/javascript",
        ".json": "application/json"
      };

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      if (ext === ".json") {
        let n;
        try {
          n = parseInt(req.url.substring(1, req.url.lastIndexOf(".")));
        } catch (e) {
          res.writeHead(404);
          res.send("Invalid value...");
        }

        let sorted = Object.keys(data)
          .sort((a, b) => data[b] - data[a])
          .map(word => [word, data[word]])
          .slice(0, n);

        res.writeHead(200, { "Content-Type": contentType });
        res.end(JSON.stringify(sorted));
      } else {
        fs.readFile(filePath, (err, content) => {
          if (err) {
            if (err.code === "ENOENT") {
              res.writeHead(404);
              res.end("Not found...");
            } else {
              res.writeHead(500);
              res.end("Internal server error...");
            }
          } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
          }
        });
      }
    })
    .listen(port);
  console.log("Server running on PORT", port);
};

const main = async () => {
  const text = await fetchText(url);
  const data = populateKeys(text);
  return startNodeServer(data);
};

main().catch(console.error);
