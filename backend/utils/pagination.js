const paginateQuery = async (model, query, options = {}) => {
  const { page = 1, limit = 9, populate, sort } = options;
  
  // Validate pagination parameters
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 9)); // Max 100 items per page
  
  const skip = (pageNum - 1) * limitNum;
  
  // Build query chain
  let queryChain = model.find(query);
  
  // Add population if specified
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(pop => {
        queryChain = queryChain.populate(pop);
      });
    } else {
      queryChain = queryChain.populate(populate);
    }
  }
  
  // Add sorting if specified
  if (sort) {
    queryChain = queryChain.sort(sort);
  }
  
  // Execute queries in parallel for better performance
  const [data, total] = await Promise.all([
    queryChain.skip(skip).limit(limitNum),
    model.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(total / limitNum);
  
  return {
    data,
    pagination: {
      total,
      page: pageNum,
      totalPages,
      limit: limitNum,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  };
};

const buildQuery = (reqQuery, fieldMappings = {}) => {
  const query = {};
  
  // Handle text search
  if (reqQuery.search && reqQuery.search.trim()) {
    const searchRegex = { $regex: reqQuery.search.trim(), $options: 'i' };
    const searchFields = fieldMappings.search || ['name', 'email'];
    
    if (searchFields.length === 1) {
      query[searchFields[0]] = searchRegex;
    } else {
      query.$or = searchFields.map(field => ({ [field]: searchRegex }));
    }
  }
  
  // Handle exact matches
  const exactMatchFields = ['status', 'role', 'category', 'type', 'isClosed'];
  exactMatchFields.forEach(field => {
    if (reqQuery[field] !== undefined && reqQuery[field] !== '') {
      const mappedField = fieldMappings[field] || field;
      query[mappedField] = reqQuery[field];
    }
  });
  
  // Handle location search
  if (reqQuery.location && reqQuery.location.trim()) {
    const locationField = fieldMappings.location || 'location';
    query[locationField] = { $regex: reqQuery.location.trim(), $options: 'i' };
  }
  
  // Handle keyword search for jobs
  if (reqQuery.keyword && reqQuery.keyword.trim()) {
    const keywordRegex = { $regex: reqQuery.keyword.trim(), $options: 'i' };
    query.$or = [
      { title: keywordRegex },
      { 'company.companyName': keywordRegex }
    ];
  }
  
  return query;
};

module.exports = {
  paginateQuery,
  buildQuery
};