import api from './api.js'

// Company Info API
export const companyInfoApi = {
  // Get all company info records
  getAll: (params = {}) => {
    return api.get('/admin/api/companyInfo', { params })
  },

  // Get company info by ID
  getById: (id) => {
    return api.get(`/admin/api/companyInfo/${id}`)
  },

  // Create new company info
  create: (data) => {
    return api.post('/admin/api/companyInfo', data)
  },

  // Update company info
  update: (id, data) => {
    return api.put(`/admin/api/companyInfo/${id}`, data)
  },

  // Delete company info
  delete: (id) => {
    return api.delete(`/admin/api/companyInfo/${id}`)
  }
}

// Banner API
export const bannerApi = {
  // Get all banner records
  getAll: (params = {}) => {
    return api.get('/admin/api/banner', { params })
  },

  // Get banner by ID
  getById: (id) => {
    return api.get(`/admin/api/banner/${id}`)
  },

  // Create new banner
  create: (data) => {
    return api.post('/admin/api/banner', data)
  },

  // Update banner
  update: (id, data) => {
    return api.put(`/admin/api/banner/${id}`, data)
  },

  // Delete banner
  delete: (id) => {
    return api.delete(`/admin/api/banner/${id}`)
  }
}

// About Company API
export const aboutCompanyApi = {
  // Get all about company records
  getAll: (params = {}) => {
    return api.get('/admin/api/about-company', { params })
  },

  // Get about company by ID
  getById: (id) => {
    return api.get(`/admin/api/about-company/${id}`)
  },

  // Create new about company
  create: (data) => {
    return api.post('/admin/api/about-company', data)
  },

  // Update about company
  update: (id, data) => {
    return api.put(`/admin/api/about-company/${id}`, data)
  },

  // Delete about company
  delete: (id) => {
    return api.delete(`/admin/api/about-company/${id}`)
  }
}

// Quote Price API
export const quotePriceApi = {
  // Get all quote price records
  getAll: (params = {}) => {
    return api.get('/admin/api/quote-price', { params })
  },

  // Get quote price by ID
  getById: (id) => {
    return api.get(`/admin/api/quote-price/${id}`)
  },

  // Create new quote price
  create: (data) => {
    return api.post('/admin/api/quote-price', data)
  },

  // Update quote price
  update: (id, data) => {
    return api.put(`/admin/api/quote-price/${id}`, data)
  },

  // Delete quote price
  delete: (id) => {
    return api.delete(`/admin/api/quote-price/${id}`)
  }
}

// Contact Info API
export const contactInfoApi = {
  // Get all contact info records
  getAll: (params = {}) => {
    return api.get('/admin/api/contact-info', { params })
  },

  // Get contact info by ID
  getById: (id) => {
    return api.get(`/admin/api/contact-info/${id}`)
  },

  // Create new contact info
  create: (data) => {
    return api.post('/admin/api/contact-info', data)
  },

  // Update contact info
  update: (id, data) => {
    return api.put(`/admin/api/contact-info/${id}`, data)
  },

  // Delete contact info
  delete: (id) => {
    return api.delete(`/admin/api/contact-info/${id}`)
  }
}

// Base Info API
export const baseInfoApi = {
  // Get all base info records
  getAll: (params = {}) => {
    return api.get('/admin/api/base-info', { params })
  },

  // Get base info by ID
  getById: (id) => {
    return api.get(`/admin/api/base-info/${id}`)
  },

  // Create new base info
  create: (data) => {
    return api.post('/admin/api/base-info', data)
  },

  // Update base info
  update: (id, data) => {
    return api.put(`/admin/api/base-info/${id}`, data)
  },

  // Delete base info
  delete: (id) => {
    return api.delete(`/admin/api/base-info/${id}`)
  }
}

// Portal API (Public endpoints)
export const portalApi = {
  // Get company info for landing page
  getCompanyInfo: () => {
    return api.get('/companyInfo')
  },

  // Get banner for landing page
  getBanner: () => {
    return api.get('/banner')
  },

  // Get about company for landing page
  getAboutCompany: () => {
    return api.get('/about-company')
  },

  // Get quote price for landing page
  getQuotePrice: () => {
    return api.get('/quote-price')
  },

  // Get contact info for landing page
  getContactInfo: () => {
    return api.get('/contact-info')
  },

  // Get base info for landing page
  getBaseInfo: () => {
    return api.get('/base-info')
  },

  // Health check
  healthCheck: () => {
    return api.get('/health')
  }
}

export default {
  companyInfoApi,
  bannerApi,
  aboutCompanyApi,
  quotePriceApi,
  contactInfoApi,
  baseInfoApi,
  portalApi
}