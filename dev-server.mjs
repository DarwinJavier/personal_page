import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

http
  .createServer((request, response) => {
    let requestPath = decodeURIComponent(request.url.split("?")[0]);
    if (requestPath === "/") requestPath = "/index.html";
    if (requestPath.endsWith("/")) requestPath += "index.html";

    const filePath = path.normalize(path.join(root, requestPath));
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, body) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "content-type": types[path.extname(filePath)] || "application/octet-stream",
      });
      response.end(body);
    });
  })
  .listen(8000, "127.0.0.1");
