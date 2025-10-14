const { createInvitation, getInvitationsByUser } = require("./invitation.db");

exports.createInvitation = async (invitation) => {
    return await createInvitation(invitation);
};

exports.getInvitationsByUser = async (userId) => {
    return await getInvitationsByUser(userId);
}