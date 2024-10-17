const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/", userController.getAllUsers);

userRouter.post("/", userController.createUser);

userRouter.patch("/modifyUser/:user_id", userController.updateUser);

userRouter.get("/:user_id", userController.getOneUser);

userRouter.delete("/:user_id", userController.deleteUser);

module.exports = userRouter;
