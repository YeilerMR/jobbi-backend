const { connect } = require("mssql");
const { createConnection } = require("../../utils/database/dbconnection");
const { findBranchById } = require("../business/business.db");
const { getUserById, updateUserRole } = require("../user/user.db");

const tbInvitation = "Invitation";

const Roles = {
    ADMIN: 1,
    CLIENT: 2,
    EMPLOYEE: 3,
};

async function createInvitation(invitation) {
    const connection = await createConnection();

    try {
        const { id_client, id_branch, state_invitation } = invitation;

        await validateUserRoleForUpgrade(id_client);

        const [result] = await connection.execute(
            `INSERT INTO ${tbInvitation} (id_client, id_branch, state_invitation) VALUES (?, ?, ?)`,
            [id_client, id_branch, state_invitation]
        );

        const id_invitation = result.insertId || null;

        const [rows] = await connection.execute(
            `SELECT id_invitation, id_client, id_branch, state_invitation FROM ${tbInvitation} WHERE id_invitation = ?`,
            [id_invitation]
        );

        return rows[0] || null;
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    } finally {
        await connection.end();
    }
}

async function validateUserRoleForUpgrade(userId) {
    const user = await getUserById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.id_rol === Roles.ADMIN) {
        throw new Error("Cannot downgrade an admin user");
    }

    if (user.id_rol !== Roles.CLIENT) {
        throw new Error("Only clients can be upgraded to employee");
    }

    return true;
}

async function getInvitationsByUser(userId) {
    const connection = await createConnection();

    try {
        const [rows] = await connection.execute(
            `SELECT id_invitation, id_client, id_branch, state_invitation FROM ${tbInvitation} WHERE id_client = ?`,
            [userId]
        );

        return rows;
    } catch (error) {
        throw err;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createInvitation,
    getInvitationsByUser
};
