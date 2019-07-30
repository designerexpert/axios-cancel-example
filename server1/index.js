const express = require("express");
const server = express();
const axios = require("axios");

const CancelToken = axios.CancelToken;
const tokens = { api1Cancel: null, api2Cancel: null };

const generateToken = property => {
    return {
        cancelToken: new CancelToken(cancelFunction => {
            tokens[property] = cancelFunction;
        })
    };
};

const PORT = 8080;

// ------------------------- API 1 ------------------------------------------
server.post("/api1", (req, res) => {
    const tokenObj = generateToken("api1Cancel");
    console.log("TOKEN OBJ API1:", tokenObj);
    axios
        .post("http://localhost:8090", req.body, tokenObj)
        .then(({ data }) => {
            console.log("DATA RECEIVED FROM API1:", data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send(err.message);

            console.error("ERROR RECEIVED AT API1", err.message);
        });
});

server.get("/api1/cancel", (req, res) => {
    if (typeof tokens.api1Cancel === "function") {
        tokens.api1Cancel("Cancel Requested By User");
        res.send("Cancelled API 1 Request Successfully");
    }
});

// ------------------------- API 2 ------------------------------------------

server.post("/api2", (req, res) => {
    const tokenObj = generateToken("api2Cancel");
    console.log("TOKEN OBJ API2:", tokenObj);
    axios
        .post("http://localhost:8090", req.body, tokenObj)
        .then(({ data }) => {
            console.log("DATA RECEIVED FROM API2:", data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send(err.message);
            console.error("ERROR RECEIVED AT API2", err.message);
        });
});

server.get("/api2/cancel", (req, res) => {
    if (typeof tokens.api2Cancel === "function") {
        tokens.api2Cancel("Cancel Requested By User");
        res.send("Cancelled API 2 Request Successfully");
    }
});

server.listen(PORT, () => {
    console.log(`> Server Listening on Port: [${PORT}]`);
});
