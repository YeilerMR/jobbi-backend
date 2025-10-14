const express = require("express");
const router = express.Router();
const verifyToken = require("../../utils/services/verifyToken");
const invitationController = require("./invitation.controller");

router.post("/", verifyToken(), invitationController.createInvitation);

router.get("/", verifyToken(), invitationController.getInvitationsByUser);

module.exports = router;