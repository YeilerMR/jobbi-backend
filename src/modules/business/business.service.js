const {
  insertBusiness,
  insertBranch,
  findBusinessesByUser,
  findBusinessById,
  updateBusinessById,
  softDeleteBusinessById,
  softDeleteBranchesByBusinessId
} = require('./business.db');

const { getUserById, updateUserRole } = require('../user/user.db');

exports.createBusinessFlow = async (userId, businessData) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  // Create business
  const businessToCreate = {
    id_user_admin: userId,
    name: businessData.name,
    location: businessData.location,
    phone: businessData.phone,
    email: businessData.email,
    state_business: 1
  };

  const business = await insertBusiness(businessToCreate);

  // Create branch
  const branch = await insertBranch({
    id_business: business.id_business,
    name: business.name,
    location: business.location,
    phone: business.phone,
    email: business.email,
    state_branch: 1
  });

  // Update role if client
  if (user.id_rol === 2) {
    await updateUserRole(userId, 1);
    user.id_rol = 1;
  }

  return { business, branch, updatedUser: user };
};

exports.listBusinessesByUser = async (userId) => {
  return await findBusinessesByUser(userId);
};

exports.getBusinessById = async (userId, businessId) => {
  const business = await findBusinessById(businessId);

  // Check ownership
  if (!business || business.id_user_admin !== userId || business.state_business !== 1) {
    return null;
  }

  return business;
};

exports.updateBusiness = async (userId, businessId, updateData) => {
  const business = await findBusinessById(businessId);

  if (!business || business.id_user_admin !== userId ) {//|| business.state_business !== 1
    return null;
  }

  const updatedBusiness = await updateBusinessById(businessId, updateData);

  return updatedBusiness;
};

exports.deleteBusiness = async (userId, businessId) => {
  const business = await findBusinessById(businessId);

  if (!business || business.id_user_admin !== userId || business.state_business !== 1) {
    return false;
  }

  // Soft delete: change state_business to 0 (inactive)
  await softDeleteBusinessById(businessId);

  // Soft delete associated branches
  await softDeleteBranchesByBusinessId(businessId);

  return true;
};
