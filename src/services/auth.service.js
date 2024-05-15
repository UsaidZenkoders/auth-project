const fsPromises = require("fs/promises");
const { users, setUsers } = require("./users.service");
const bcrypt = require("bcrypt");
const path = require("path");

const { generateToken } = require("../middlewares/generateToken");

const RegisterUser = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) {
    return {
      statusCode: 401,
      data: { message: "email and password are required" },
    };
  }
  const alreadyExist = users.find((user) => user.email === email);
  const hashedPassword = await bcrypt.hash(password, 10);
  if (alreadyExist) {
    return { statusCode: 401, data: { message: "User already exists" } };
  } else {
    const accessToken = generateToken({ email });
    let newUser = { email, password: hashedPassword, username };
    setUsers([...users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify([...users, newUser])
    );
    return { statusCode: 201, data: { newUser, accessToken } };
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return {
      statusCode: 401,
      data: { message: "email and password are required" },
    };
  }
  const foundUser = users.find((user) => user.email === email);
  if (foundUser) {
  
    const matchPass = await bcrypt.compare(password, foundUser.password);
    if (matchPass) {
      const accessToken = generateToken({ email });
      return {
        statusCode: 200,
        data: { message: "User logged in successfully", accessToken },
      };
    } else {
      return {
        statusCode: 401,
        data: { message: "Invalid Email or Password" },
      };
    }
  } else {
    return { statusCode: 401, data: { message: "User not found" } };
  }
};

module.exports = { RegisterUser, LoginUser };
