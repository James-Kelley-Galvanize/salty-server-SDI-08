const app = require("./app");
const port = 8080;
app.listen(port, () => {
  console.log(`App is listening at ${port} on localhost`);
});
