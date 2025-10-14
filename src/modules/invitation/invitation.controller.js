const invitationService = require("./invitation.service");

exports.createInvitation = async (req, res) => {
    try {
        const user = req.user;

        if (!user || user.id_rol !== 1) {
            return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
        }

        const invitationData = req.body;

        const invitation = await invitationService.createInvitation(invitationData);

        if (!invitation) {
            return res.status(400).json({
                success: false,
                message: "Error while creating the invitation for the user"
            });
        }

        res.status(201).json({
            success: true,
            message: "Invitation created successfully!",
            data: invitation
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInvitationsByUser = async (req, res) => {
    try {
        const user = req.user;

        if (!user || user.id_rol !== 2) {
            res.status(405).json({
                success: false,
                message: "Method Not Allowed"
            });
            return;
        }

        const invitations = await invitationService.getInvitationsByUser(user.id_user);

        if (!Array.isArray(invitations) || invitations.length === 0) {
            res.status(400).json({
                success: false,
                message: "There are no invitations registered"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: invitations
        });
    } catch (error) {
        
    }
}