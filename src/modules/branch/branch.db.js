const { createConnection } = require("../../utils/database/dbconnection");

const tbBranch = "Branch";

async function getBranchesByUser(userId) {
    const connection = await createConnection();
    const [rows] = await connection.execute(
        `SELECT 
            b.id_branch,
            b.id_business,
            b.name AS branch_name,
            b.location AS branch_location,
            b.phone AS branch_phone,
            b.email AS branch_email,
            b.state_branch
        FROM Branch b
        JOIN Business bs ON b.id_business = bs.id_business
        JOIN User u ON bs.id_user_admin = u.id_user
        WHERE u.id_user = ?;
        `, [userId]
    );
    await connection.end();
    return rows;
}

async function getBranchesByBusiness(businessId) {
    const connection = await createConnection();
    const [rows] = await connection.execute(
        `SELECT id_branch, id_business, name, location, phone, email, state_branch FROM ${tbBranch} WHERE id_business = ? AND state_branch = 1`, [businessId]
    );
    await connection.end();
    return rows;
}

async function getAllBranches() {
    const connection = await createConnection();
    const [rows] = await connection.execute(
        `SELECT id_branch, id_business, name, location, phone, email, state_branch FROM ${tbBranch} WHERE state_branch = 1`
    );
    await connection.end();
    return rows;
}

async function getBranchById(id_branch) {
    const connection = await createConnection();
    const [rows] = await connection.execute(
        `SELECT id_branch, id_business, name, location, phone, email, state_branch FROM ${tbBranch} WHERE id_branch = ? AND state_branch = 1`, [id_branch]
    );
    await connection.end();
    return rows[0];
}

async function createBranch(branch) {
    const connection = await createConnection();
    const [result] = await connection.execute(
        `INSERT INTO ${tbBranch} (id_business, name, location, phone, email, state_branch) VALUES (?, ?, ?, ?, ?, 1)`,
        [branch.id_business, branch.name, branch.location, branch.phone, branch.email]
    );
    await connection.end();
    return result.insertId;
}

async function updateBranch(id_branch, branch) {
    try {
        const connection = await createConnection();

        const [result] = await connection.execute(
            `UPDATE ${tbBranch} SET id_business = ?, name = ?, location = ?, phone = ?, email = ?, state_branch = ? WHERE id_branch = ?`,
            [branch.id_business, branch.name, branch.location, branch.phone, branch.email, branch.state_branch, id_branch]
        );
        await connection.end();
        return result.affectedRows > 0;
    } catch (err) {
        console.error("SQL Error:", err);
        return false;
    }
}

async function deleteBranch(id_branch) {
    const connection = await createConnection();
    const [result] = await connection.execute(
        `UPDATE ${tbBranch} SET state_branch = 0 WHERE id_branch = ?`, [id_branch]
    );
    await connection.end();
    return result.affectedRows > 0;
}

async function isActive(id_branch) {
    const connection = await createConnection();
    const [result] = await connection.execute(
        `SELECT * FROM ${tbBranch} WHERE id_branch = ? AND state_branch = 1`,
        [id_branch]
    );
    await connection.end();
    return result.length > 0;
}

module.exports = {
    getBranchesByUser,
    getBranchesByBusiness,
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};