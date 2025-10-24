const express = require("express");
const router = express.Router();
const giftController = require("./gift.controller");
const verifyToken = require("../../utils/services/verifyToken");

router.post("/assoc/:giftId", verifyToken(), giftController.createAssociationUserGift);

module.exports = router;