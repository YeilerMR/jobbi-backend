const { createConnection } = require('../../utils/database/dbconnection');

async function insertBusiness(business) {
  const connection = await createConnection();

  const [result] = await connection.execute(
    `INSERT INTO Business (id_user_admin, name, location, phone, email, state_business)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      business.id_user_admin,
      business.name,
      business.location,
      business.phone,
      business.email,
      business.state_business
    ]
  );

  // Assuming result.insertId or similar
  const id_business = result.insertId || null;

  // Fetch the inserted business
  const [rows] = await connection.execute(
    `SELECT * FROM Business WHERE id_business = ?`,
    [id_business]
  );

  await connection.end();

  return rows[0];
}

async function insertBranch(branch) {
  const connection = await createConnection();

  const [result] = await connection.execute(
    `INSERT INTO Branch (id_business, name, location, phone, email, state_branch)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      branch.id_business,
      branch.name,
      branch.location,
      branch.phone,
      branch.email,
      branch.state_branch
    ]
  );

  const id_branch = result.insertId || null;

  const [rows] = await connection.execute(
    `SELECT * FROM Branch WHERE id_branch = ?`,
    [id_branch]
  );

  await connection.end();

  return rows[0];
}

async function findBusinessesByUser(userId) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Business WHERE id_user_admin = ?`,// AND state_business = 1
    [userId]
  );

  await connection.end();

  return rows;
}

async function findBusinessById(businessId) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Business WHERE id_business = ?`,//AND state_business = 1
    [businessId]
  );

  await connection.end();
  
  return rows[0];
}

async function findBranchById(id_branch) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Branch WHERE id_branch = ?`,
    [id_branch]
  );

  await connection.end();

  return rows[0]; // Return the branch if found, else undefined
}

async function getBusinessByBranch (id_branch) {
  try {

    const connection = await createConnection();

    const [rows] = await connection.execute(
      `
      SELECT 
        b.id_business,
        b.id_user_admin,
        b.name AS business_name,
        b.location AS business_location,
        b.phone AS business_phone,
        b.email AS business_email,
        b.state_business,
        br.id_branch,
        br.name AS branch_name,
        br.location AS branch_location,
        br.phone AS branch_phone,
        br.email AS branch_email,
        br.state_branch
      FROM Branch br
      INNER JOIN Business b 
        ON br.id_business = b.id_business
      WHERE br.id_branch = ?
      LIMIT 1;
      `,
      [id_branch]
    );

    if (rows.length === 0) {
      return null; // Branch not found or no related business
    }

    return rows[0];
  } catch (error) {
    console.error("Error in getBusinessByBranch:", error);
    throw error;
  }
};

  async function updateBusinessById(businessId, updateData) {
    const connection = await createConnection();

    // Build SET dynamically, only for allowed fields
    const allowedFields = ['name', 'location', 'phone', 'email', 'state_business'];
    const setClauses = [];
    const params = [];

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        params.push(updateData[key]);
      }
    }

    if (setClauses.length === 0) {
      await connection.end();
      return null;
    }

    params.push(businessId);

    await connection.execute(
      `UPDATE Business SET ${setClauses.join(', ')} WHERE id_business = ?`,
      params
    );

    // Return updated business
    const [rows] = await connection.execute(
      `SELECT * FROM Business WHERE id_business = ?`,
      [businessId]
    );

    await connection.end();

    return rows[0];
  }

async function softDeleteBusinessById(businessId) {
  const connection = await createConnection();

  await connection.execute(
    `UPDATE Business SET state_business = 0 WHERE id_business = ?`,
    [businessId]
  );

  await connection.end();
}

async function softDeleteBranchesByBusinessId(businessId) {
  const connection = await createConnection();

  await connection.execute(
    `UPDATE Branch SET state_branch = 0 WHERE id_business = ?`,
    [businessId]
  );

  await connection.end();
}

/**
 * Búsqueda dinámica de negocios con filtros múltiples
 * searchParams: { name?, location?, specialty?, service?, limit?, offset? }
 */
async function searchBusinesses(searchParams = {}) {
  const connection = await createConnection();

  let baseQuery = `
    SELECT DISTINCT 
      b.id_business,
      b.name as business_name,
      b.location as business_location,
      b.phone as business_phone,
      b.email as business_email,
      br.id_branch,
      br.name as branch_name,
      br.location as branch_location,
      br.phone as branch_phone,
      br.email as branch_email
    FROM Business b
    LEFT JOIN Branch br ON b.id_business = br.id_business
    LEFT JOIN Service s ON br.id_branch = s.id_branch
    LEFT JOIN Specialty sp ON s.id_specialty = sp.id_specialty
    WHERE b.state_business = 1 AND (br.state_branch = 1 OR br.state_branch IS NULL)
  `;

  const params = [];
  const conditions = [];

  // Filtro por nombre de negocio
  if (searchParams.name) {
    conditions.push(`(b.name LIKE ? OR br.name LIKE ?)`);
    const namePattern = `%${searchParams.name}%`;
    params.push(namePattern, namePattern);
  }

  // Filtro por ubicación
  if (searchParams.location) {
    conditions.push(`(b.location LIKE ? OR br.location LIKE ?)`);
    const locationPattern = `%${searchParams.location}%`;
    params.push(locationPattern, locationPattern);
  }

  // Filtro por especialidad/categoría
  if (searchParams.specialty) {
    conditions.push(`sp.name LIKE ?`);
    params.push(`%${searchParams.specialty}%`);
  }

  // Filtro por servicio
  if (searchParams.service) {
    conditions.push(`(s.name LIKE ? OR s.description LIKE ?)`);
    const servicePattern = `%${searchParams.service}%`;
    params.push(servicePattern, servicePattern);
  }

  // Agregar condiciones al query
  if (conditions.length > 0) {
    baseQuery += ` AND (${conditions.join(' OR ')})`;
  }

  // Ordenar por relevancia (negocios con más coincidencias primero)
  baseQuery += ` ORDER BY b.name ASC`;

  // Paginación
  const limit = searchParams.limit || 50;
  const offset = searchParams.offset || 0;
  baseQuery += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await connection.execute(baseQuery, params);

  await connection.end();

  // Agrupar resultados por negocio
  const businessMap = new Map();

  rows.forEach(row => {
    const businessId = row.id_business;

    if (!businessMap.has(businessId)) {
      businessMap.set(businessId, {
        id_business: row.id_business,
        name: row.business_name,
        location: row.business_location,
        phone: row.business_phone,
        email: row.business_email,
        branches: []
      });
    }

    // Agregar branch si existe
    if (row.id_branch) {
      const business = businessMap.get(businessId);
      const existingBranch = business.branches.find(b => b.id_branch === row.id_branch);

      if (!existingBranch) {
        business.branches.push({
          id_branch: row.id_branch,
          name: row.branch_name,
          location: row.branch_location,
          phone: row.branch_phone,
          email: row.branch_email
        });
      }
    }
  });

  return Array.from(businessMap.values());
}

/**
 * Obtener servicios y especialidades de un negocio específico
 */
async function getBusinessServicesAndSpecialties(businessId) {
  const connection = await createConnection();

  const [rows] = await connection.execute(`
    SELECT DISTINCT
      s.id_service,
      s.name as service_name,
      s.description as service_description,
      s.price,
      s.duration,
      sp.id_specialty,
      sp.name as specialty_name,
      br.id_branch,
      br.name as branch_name
    FROM Business b
    LEFT JOIN Branch br ON b.id_business = br.id_business
    LEFT JOIN Service s ON br.id_branch = s.id_branch
    LEFT JOIN Specialty sp ON s.id_specialty = sp.id_specialty
    WHERE b.id_business = ? AND b.state_business = 1 
      AND (br.state_branch = 1 OR br.state_branch IS NULL)
      AND (s.state_service = 1 OR s.state_service IS NULL)
    ORDER BY sp.name, s.name
  `, [businessId]);

  await connection.end();

  // Agrupar por especialidad
  const specialtyMap = new Map();

  rows.forEach(row => {
    if (!row.id_specialty) return;

    const specialtyId = row.id_specialty;

    if (!specialtyMap.has(specialtyId)) {
      specialtyMap.set(specialtyId, {
        id_specialty: row.id_specialty,
        name: row.specialty_name,
        services: []
      });
    }

    if (row.id_service) {
      const specialty = specialtyMap.get(specialtyId);
      const existingService = specialty.services.find(s => s.id_service === row.id_service);

      if (!existingService) {
        specialty.services.push({
          id_service: row.id_service,
          name: row.service_name,
          description: row.service_description,
          price: row.price,
          duration: row.duration,
          branch_id: row.id_branch,
          branch_name: row.branch_name
        });
      }
    }
  });

  return Array.from(specialtyMap.values());
}

module.exports = {
  insertBusiness,
  insertBranch,
  findBusinessesByUser,
  findBusinessById,
  updateBusinessById,
  softDeleteBusinessById,
  softDeleteBranchesByBusinessId,
  findBranchById,
  searchBusinesses,
  getBusinessServicesAndSpecialties,
  getBusinessByBranch
};
