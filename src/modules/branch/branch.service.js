
const {
    getBranchesByUser,
    getBranchesByBusiness,
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
} = require("./branch.db");

const subscriptionService = require("../subscriptions/subscriptions.service");

exports.getBranchesByUser = async (userId) => {
    return await getBranchesByUser(userId);
};

exports.getBranchesByBusiness = async (businessId) => {
    return await getBranchesByBusiness(businessId);
};

exports.getAllBranches = async () => {
    return await getAllBranches();
};

exports.getBranchById = async (id_branch) => {
    return await getBranchById(id_branch);
};

exports.createBranch = async (userId, branch) => {
    // Validar límites del plan antes de crear la sucursal
    const validation = await subscriptionService.canCreateBranch(userId, branch.id_business);
    
    if (!validation.allowed) {
        const error = new Error(validation.message);
        error.status = 403; // Forbidden
        error.details = {
            currentCount: validation.currentCount,
            limit: validation.limit
        };
        throw error;
    }
    
    return await createBranch(branch);
};

exports.updateBranch = async (id_branch, branch) => {
    return await updateBranch(id_branch, branch);
};

exports.deleteBranch = async (id_branch) => {
    return await deleteBranch(id_branch);
};