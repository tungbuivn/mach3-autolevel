import express from "express";
var app = express();
app.all((req, res) => {
  res.send("ok");
});
app.listen(3000);
