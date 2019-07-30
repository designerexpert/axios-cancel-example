const express = require("express");
const server = express();
const PORT = 8090;

server.post("/", (req, res) => {
    const timestamp = new Date().toLocaleString();
    setTimeout(() => {
        res.send({ received: req.body, timestamp });
    }, 10000);
});

server.listen(PORT, () => {
    console.log(`> Server Listening on Port: [${PORT}]`);
});
