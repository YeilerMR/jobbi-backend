const {
    createAssociationUserGift
} = require("./gift.db");

exports.createAssociationUserGift = async (userId, giftId) => {
    return await createAssociationUserGift(userId, giftId);
}