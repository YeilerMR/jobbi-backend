const express = require('express');
const router = express.Router();
const controller = require('./gifts.controller');
const verifyToken = require('../../utils/services/verifyToken');

router.post("/assoc/:giftId", verifyToken(), controller.createAssociationUserGift);

router.put("/activate/:giftId", verifyToken(), controller.updateUserGiftStatus);

// List available gifts for the logged-in user's role
router.get('/available', verifyToken(), controller.listAvailableByRole);

// List gifts related to the logged-in user
router.get('/mine', verifyToken(), controller.listUserGifts);

// Get points/points-summary for the logged-in user (taken from JWT)
router.get('/points', verifyToken(), controller.getGifts);

// QR endpoints
router.post('/qr/create', verifyToken(), controller.createQRCode);
// validation can be done without auth (scanners), but accepts optional JWT to mark usedBy
router.post('/qr/validate', controller.validateQRCode);

module.exports = router;
