const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;
const rootDirectory = __dirname;
const logFile = path.join(rootDirectory, "yes-clicks.log");

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json"
};

function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(data));
}

const server = http.createServer((request, response) => {
    if (request.method === "POST" && request.url === "/api/yes") {
        const entry = `${new Date().toISOString()} - Yes button clicked${require("os").EOL}`;

        fs.appendFile(logFile, entry, (error) => {
            if (error) {
                console.error("Unable to save the Yes click:", error);
                sendJson(response, 500, { ok: false });
                return;
            }

            sendJson(response, 200, { ok: true });
        });
        return;
    }

    if (request.method !== "GET") {
        sendJson(response, 405, { error: "Method not allowed" });
        return;
    }

    const requestedPath = decodeURIComponent(request.url.split("?")[0]);
    const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
    const filePath = path.resolve(rootDirectory, relativePath);

    if (!filePath.startsWith(rootDirectory + path.sep)) {
        sendJson(response, 403, { error: "Forbidden" });
        return;
    }

    fs.readFile(filePath, (error, file) => {
        if (error) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Not found");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        response.writeHead(200, {
            "Content-Type": contentTypes[extension] || "application/octet-stream"
        });
        response.end(file);
    });
});

server.listen(port, () => {
    console.log(`Dating website running at http://localhost:${port}`);
});
