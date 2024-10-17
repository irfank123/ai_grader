const express = require("express");
const responseController = require("../controllers/responseController");
const responseRouter = express.Router();

responseRouter.get("/", responseController.getAllResponses);

responseRouter.post("/", responseController.createResponse);

responseRouter.patch("/modifyResponse/:response_id", responseController.updateResponse);

responseRouter.get("/:response_id", responseController.getOneResponse);

responseRouter.delete("/:response_id", responseController.deleteResponse);

module.exports = responseRouter;
