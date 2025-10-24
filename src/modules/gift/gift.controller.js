const giftService = require("./gift.service");

exports.createAssociationUserGift = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const giftId = req.params.giftId;

        const creation = await giftService.createAssociationUserGift(userId, giftId);

        res.status(201).json({
            success: true,
            data: creation
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}