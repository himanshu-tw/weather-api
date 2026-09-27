import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({ msg: "hello world" });
});

app.listen("8000", console.log("server is running"));
