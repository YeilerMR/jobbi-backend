const branchService = require("./branch.service");

exports.getBranchesByBusiness = async (req, res) => {

    try {
        if (req.user === null || req.user.id_rol != 1) {
            res.status(405).json({
                success: false,
                message: "Method Not Allowed"
            })
            return;
        }

        const businessId = req.query.businessId;

        const userBranches = await branchService.getBranchesByBusiness(businessId);

        if (!Array.isArray(userBranches) || userBranches.length === 0) {
            res.status(400).json({
                success: false,
                message: "There are no branches associated"
            });
            return;
        }

        res.status(200).json({ success: true, data: userBranches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}