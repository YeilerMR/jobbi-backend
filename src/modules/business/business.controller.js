const businessService = require('./business.service');
const subscriptionService = require('../subscriptions/subscriptions.service');

exports.createBusiness = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const businessData = req.body;

    // Validate business limit before creating
    const validation = await subscriptionService.canCreateBusiness(userId);
    if (!validation.allowed) {
      return res.status(403).json({
        success: false,
        message: validation.message,
        reason: validation.reason,
        currentCount: validation.currentCount,
        limit: validation.limit
      });
    }

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

/**
 * Endpoint para búsqueda dinámica de negocios
 * GET /business/search?name=...&location=...&specialty=...&service=...&limit=...&offset=...
 */
exports.searchBusinesses = async (req, res) => {
  try {
    const searchParams = {
      name: req.query.name,
      location: req.query.location,
      specialty: req.query.specialty,
      service: req.query.service,
      includeServices: req.query.includeServices,
      limit: req.query.limit,
      offset: req.query.offset
    };

    const results = await businessService.searchBusinesses(searchParams);

    res.json({
      success: true,
      message: `Found ${results.length} businesses`,
      data: results,
      pagination: {
        limit: parseInt(searchParams.limit) || 50,
        offset: parseInt(searchParams.offset) || 0,
        total: results.length
      }
    });
  } catch (error) {
    console.error('Error in searchBusinesses controller:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

/**
 * Endpoint para obtener detalles completos de un negocio
 * GET /business/:id/details
 */
exports.getBusinessDetails = async (req, res) => {
  try {
    const businessId = req.params.id;
    const businessDetails = await businessService.getBusinessDetails(businessId);

    if (!businessDetails) {
      return res.status(404).json({ 
        success: false, 
        message: "Business not found" 
      });
    }

    res.json({
      success: true,
      data: businessDetails
    });
  } catch (error) {
    console.error('Error in getBusinessDetails controller:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};
