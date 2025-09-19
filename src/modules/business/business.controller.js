const businessService = require('./business.service');

exports.createBusiness = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const businessData = req.body;

    const result = await businessService.createBusinessFlow(userId, businessData);

    res.status(201).json({
      success: true,
      message: "Business and branch created successfully",
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

exports.listBusinesses = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const businesses = await businessService.listBusinessesByUser(userId);

    res.json({ success: true, data: businesses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const businessId = req.params.id;

    const business = await businessService.getBusinessById(userId, businessId);

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    res.json({ success: true, data: business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const businessId = req.params.id;
    const updateData = req.body;

    const updatedBusiness = await businessService.updateBusiness(userId, businessId, updateData);

    if (!updatedBusiness) {
      return res.status(404).json({ success: false, message: "Business not found or unauthorized" });
    }

    res.json({ success: true, message: "Business updated", data: updatedBusiness });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const businessId = req.params.id;

    const deleted = await businessService.deleteBusiness(userId, businessId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Business not found or unauthorized" });
    }

    res.json({ success: true, message: "Business deleted (soft delete)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
