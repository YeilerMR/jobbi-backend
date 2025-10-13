const { createConnection } = require("../../utils/database/dbconnection");

const tbBranch = "Branch";

async function getBranchesByBusiness (businessId) {
    const connection = await createConnection();

    const [rows] = await connection.execute(
        `SELECT id_branch, id_business, name, location, phone, email, state_branch FROM ${tbBranch} WHERE id_business = ? AND state_branch = 1`, [businessId]
    );

    await connection.end();
    return rows;
}


module.exports = {
    getBranchesByBusiness,

};