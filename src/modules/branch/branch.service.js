
const {
    getBranchesByBusiness,
} = require("./branch.db");

exports.getBranchesByBusiness = async (businessId) => {
   return await getBranchesByBusiness(businessId);
}