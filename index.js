const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 3000;
const LoginRouter = require("./routes/Login.router");
const RegisterRouter = require("./routes/Register.router");

// app.use(bodyParser.json())
app.use(cors());
app.use(express.json());
app.use("/", LoginRouter);
app.use("/", RegisterRouter);

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
