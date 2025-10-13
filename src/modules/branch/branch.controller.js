const branchService = require("./branch.service");

exports.getBranchesByBusiness = async (req, res) => {
    try {
        if (!req.user || req.user.id_rol != 1) {
            return res.status(405).json({ success: false, message: "Method Not Allowed" });
        }
        const businessId = req.query.businessId;
        const userBranches = await branchService.getBranchesByBusiness(businessId);
        if (!Array.isArray(userBranches) || userBranches.length === 0) {
            return res.status(400).json({ success: false, message: "There are no branches associated" });
        }
        res.status(200).json({ success: true, data: userBranches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllBranches = async (req, res) => {
    try {
        const branches = await branchService.getAllBranches();
        res.status(200).json({ success: true, data: branches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBranchById = async (req, res) => {
    try {
        const id_branch = req.params.id;
        const branch = await branchService.getBranchById(id_branch);
        if (!branch) {
            return res.status(404).json({ success: false, message: "Branch not found" });
        }
        res.status(200).json({ success: true, data: branch });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createBranch = async (req, res) => {
    try {
        const { id_business, name, location, phone, email } = req.body;
        if (!id_business || !name || !location || !phone || !email) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const branch = { id_business, name, location, phone, email };
        const insertId = await branchService.createBranch(branch);
        res.status(201).json({ success: true, message: "Branch created", id_branch: insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateBranch = async (req, res) => {
    try {
        const id_branch = req.params.id;
        const { name, location, phone, email } = req.body;
        if (!name || !location || !phone || !email) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const branch = { name, location, phone, email };
        const updated = await branchService.updateBranch(id_branch, branch);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Branch not found or not updated" });
        }
        res.status(200).json({ success: true, message: "Branch updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBranch = async (req, res) => {
    try {
        const id_branch = req.params.id;
        const deleted = await branchService.deleteBranch(id_branch);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Branch not found or not deleted" });
        }
        res.status(200).json({ success: true, message: "Branch deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};