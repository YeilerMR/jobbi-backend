
const {
    getBranchesByBusiness,
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
} = require("./branch.db");

exports.getBranchesByBusiness = async (businessId) => {
    return await getBranchesByBusiness(businessId);
};

exports.getAllBranches = async () => {
    return await getAllBranches();
};

exports.getBranchById = async (id_branch) => {
    return await getBranchById(id_branch);
};

exports.createBranch = async (branch) => {
    return await createBranch(branch);
};

exports.updateBranch = async (id_branch, branch) => {
    return await updateBranch(id_branch, branch);
};

exports.deleteBranch = async (id_branch) => {
    return await deleteBranch(id_branch);
};