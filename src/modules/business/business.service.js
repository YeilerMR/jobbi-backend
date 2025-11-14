const {
  insertBusiness,
  insertBranch,
  findBusinessesByUser,
  findBusinessById,
  updateBusinessById,
  softDeleteBusinessById,
  softDeleteBranchesByBusinessId,
  searchBusinesses,
  getBusinessServicesAndSpecialties
} = require('./business.db');

const { getUserById, updateUserRole } = require('../user/user.db');

const { createDefaultCalendarForEmployee } = require('../calendar/calendar.db');

const { createEmployee } = require('../employees/employees.db');

const { createBranch } = require('../branch/branch.db');

exports.createBusinessFlow = async (userId, businessData) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  // 1. Create business
  const businessToCreate = {
    id_user_admin: userId,
    name: businessData.name,
    location: businessData.location,
    phone: businessData.phone,
    email: businessData.email,
    state_business: 1
  };

  const business = await insertBusiness(businessToCreate);

  // 2. Create branch
  const branch = await createBranch({
    id_business: business.id_business,
    name: business.name,
    location: business.location,
    phone: business.phone,
    email: business.email,
    state_branch: 1
  });

  // 3. Convert user → admin if necessary
  if (user.id_rol === 2) {
    await updateUserRole(userId, 1);
    user.id_rol = 1;
  }

  // 4. Create employee entry for business owner
  const employee = await createEmployee({
    id_branch: branch.id_branch,
    id_user: userId,
    availability: 1
  });

  // 5. Generate default calendar config for the new employee
  await createDefaultCalendarForEmployee(employee.id_employee);

  return { business, branch, employee, updatedUser: user };
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

  if (!business || business.id_user_admin !== userId) {//|| business.state_business !== 1
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

/**
 * Servicio de búsqueda dinámica de negocios
 * Permite buscar por nombre, ubicación, servicios y especialidades
 */
exports.searchBusinesses = async (searchParams) => {
  try {
    // Sanitizar parámetros de búsqueda
    const cleanParams = {
      name: searchParams.name ? searchParams.name.trim() : undefined,
      location: searchParams.location ? searchParams.location.trim() : undefined,
      specialty: searchParams.specialty ? searchParams.specialty.trim() : undefined,
      service: searchParams.service ? searchParams.service.trim() : undefined,
      limit: searchParams.limit ? Math.min(parseInt(searchParams.limit), 100) : 50,
      offset: searchParams.offset ? Math.max(parseInt(searchParams.offset), 0) : 0
    };

    // Validar que al menos un parámetro de búsqueda esté presente
    const hasSearchParam = cleanParams.name || cleanParams.location ||
      cleanParams.specialty || cleanParams.service;

    if (!hasSearchParam) {
      // Si no hay parámetros específicos, devolver negocios activos con límite
      return await searchBusinesses({ limit: cleanParams.limit, offset: cleanParams.offset });
    }

    const results = await searchBusinesses(cleanParams);

    // Enriquecer resultados con servicios y especialidades si es necesario
    if (searchParams.includeServices === 'true') {
      for (const business of results) {
        business.services_and_specialties = await getBusinessServicesAndSpecialties(business.id_business);
      }
    }

    return results;
  } catch (error) {
    console.error('Error in searchBusinesses service:', error);
    throw error;
  }
};

/**
 * Obtener detalles completos de un negocio incluyendo servicios y especialidades
 */
exports.getBusinessDetails = async (businessId) => {
  try {
    const business = await findBusinessById(businessId);
    if (!business) {
      return null;
    }

    const servicesAndSpecialties = await getBusinessServicesAndSpecialties(businessId);

    return {
      ...business,
      services_and_specialties: servicesAndSpecialties
    };
  } catch (error) {
    console.error('Error in getBusinessDetails service:', error);
    throw error;
  }
};
