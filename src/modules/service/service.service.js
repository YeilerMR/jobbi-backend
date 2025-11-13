const {
  findBranchById,
  findBusinessById
} = require('../business/business.db');

const {
  insertService,
  findServicesByBranchId,
  updateServiceById,
  softDeleteServiceById,
  findServiceById,
  findServicesByUser,
  findBranchesByService
} = require('./service.db');

exports.createService = async (userId, serviceData) => {
  const { id_branch, id_specialty, name, description, price, duration } = serviceData;
  
  // 1. Get the branch and its business
  const branch = await findBranchById(id_branch);
  if (!branch || branch.state_branch !== 1) {
    throw new Error("Branch not found or inactive.");
  }

  const business = await findBusinessById(branch.id_business);
  if (!business || business.id_user_admin !== userId ) {//|| business.state_business !== 1
    throw new Error("Unauthorized: Branch does not belong to user.");
  }

  // 2. Create the service
  const serviceToInsert = {
    id_branch,
    id_specialty,
    name,
    description,
    price,
    duration,
    state_service: 1
  };

  const createdService = await insertService(serviceToInsert);

  return createdService;
};

exports.getServicesByBranch = async (userId, branchId) => {
  const branch = await findBranchById(branchId);
  if (!branch) throw new Error("Branch not found.");

  const business = await findBusinessById(branch.id_business);
  if (!business || business.id_user_admin !== userId) {
    throw new Error("Unauthorized access.");
  }

  return await findServicesByBranchId(branchId);
};

exports.updateService = async (userId, id_service, data) => {
  const service = await findServiceById(id_service);
  if (!service) throw new Error("Service not found.");

  const branch = await findBranchById(service.id_branch);
  const business = await findBusinessById(branch.id_business);
  if (!business || business.id_user_admin !== userId) {
    throw new Error("Unauthorized.");
  }

  await updateServiceById(id_service, data);
  return true;
};

exports.deleteService = async (userId, id_service) => {
  const service = await findServiceById(id_service);
  if (!service) throw new Error("Service not found.");

  const branch = await findBranchById(service.id_branch);
  const business = await findBusinessById(branch.id_business);
  if (!business || business.id_user_admin !== userId) {
    throw new Error("Unauthorized.");
  }

  await softDeleteServiceById(id_service);
  return true;
};

exports.getServicesByUser = async (userId) => {
  return await findServicesByUser(userId);
}

exports.getBranchesByService = async (searchValue) => {
  return await findBranchesByService(searchValue);
}