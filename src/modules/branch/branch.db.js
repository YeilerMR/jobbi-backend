const { createConnection } = require("../../utils/database/dbconnection");

const tbBranch = "Branch";


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
    const connection = await createConnection();
    const [result] = await connection.execute(
        `UPDATE ${tbBranch} SET name = ?, location = ?, phone = ?, email = ? WHERE id_branch = ? AND state_branch = 1`,
        [branch.name, branch.location, branch.phone, branch.email, id_branch]
    );
    await connection.end();
    return result.affectedRows > 0;
}

async function deleteBranch(id_branch) {
    const connection = await createConnection();
    const [result] = await connection.execute(
        `UPDATE ${tbBranch} SET state_branch = 0 WHERE id_branch = ?`, [id_branch]
    );
    await connection.end();
    return result.affectedRows > 0;
}


module.exports = {
    getBranchesByBusiness,
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};