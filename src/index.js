const express = require("express");

const router = require("./movieContorller");
const app = express();
const port = 3500;

app.use(express.json());

app.use(router);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
