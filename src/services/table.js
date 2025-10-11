import api from './api'

// Table service for paginated data
export const tableService = {
  // Get content list with pagination
  async getContentList(params = {}) {
    try {
      // For demo purposes, we'll simulate API call with dummy data
      // In real app, this would be: const response = await api.get('/content', { params })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data
      const mockData = [
        {
          id: 1,
          title: 'Panduan Penggunaan Dashboard',
          category: 'Tutorial',
          status: 'published',
          author: 'Admin User',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z',
          views: 1250
        },
        {
          id: 2,
          title: 'Tips Optimasi Website',
          category: 'Tips',
          status: 'published',
          author: 'John Doe',
          createdAt: '2024-01-18T09:15:00Z',
          updatedAt: '2024-01-19T16:20:00Z',
          views: 890
        },
        {
          id: 3,
          title: 'Update Fitur Terbaru',
          category: 'News',
          status: 'draft',
          author: 'Jane Smith',
          createdAt: '2024-01-20T11:00:00Z',
          updatedAt: '2024-01-20T11:00:00Z',
          views: 0
        },
        {
          id: 4,
          title: 'Cara Menggunakan API',
          category: 'Documentation',
          status: 'published',
          author: 'Admin User',
          createdAt: '2024-01-22T08:45:00Z',
          updatedAt: '2024-01-22T08:45:00Z',
          views: 567
        },
        {
          id: 5,
          title: 'Best Practices Development',
          category: 'Tutorial',
          status: 'pending',
          author: 'Mike Johnson',
          createdAt: '2024-01-23T13:30:00Z',
          updatedAt: '2024-01-23T13:30:00Z',
          views: 0
        }
      ]

      // Apply filters
      let filteredData = [...mockData]
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase()
        filteredData = filteredData.filter(item =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.author.toLowerCase().includes(searchTerm)
        )
      }
      
      if (params.category) {
        filteredData = filteredData.filter(item => item.category === params.category)
      }
      
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status)
      }

      // Apply sorting
      if (params.sortBy) {
        filteredData.sort((a, b) => {
          const aVal = getNestedValue(a, params.sortBy)
          const bVal = getNestedValue(b, params.sortBy)
          
          if (params.sortOrder === 'desc') {
            return bVal > aVal ? 1 : -1
          } else {
            return aVal > bVal ? 1 : -1
          }
        })
      }

      // Apply pagination
      const page = parseInt(params.page) || 1
      const limit = parseInt(params.limit) || 10
      const total = filteredData.length
      const totalPages = Math.ceil(total / limit)
      const from = (page - 1) * limit + 1
      const to = Math.min(page * limit, total)
      
      const paginatedData = filteredData.slice((page - 1) * limit, page * limit)

      const mockResponse = {
        data: {
          success: true,
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages,
            total,
            limit,
            from,
            to,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
          }
        }
      }
      
      return mockResponse
    } catch (error) {
      throw error
    }
  },

  // Get users list with pagination
  async getUsersList(params = {}) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock data
      const mockData = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@demo.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-23T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'editor',
          status: 'active',
          lastLogin: '2024-01-22T15:45:00Z',
          createdAt: '2024-01-05T00:00:00Z'
        },
        {
          id: 3,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'viewer',
          status: 'inactive',
          lastLogin: '2024-01-15T09:20:00Z',
          createdAt: '2024-01-10T00:00:00Z'
        }
      ]

      // Apply filters and pagination (similar to content)
      let filteredData = [...mockData]
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase()
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.email.toLowerCase().includes(searchTerm)
        )
      }
      
      if (params.role) {
        filteredData = filteredData.filter(item => item.role === params.role)
      }
      
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status)
      }

      // Apply sorting
      if (params.sortBy) {
        filteredData.sort((a, b) => {
          const aVal = getNestedValue(a, params.sortBy)
          const bVal = getNestedValue(b, params.sortBy)
          
          if (params.sortOrder === 'desc') {
            return bVal > aVal ? 1 : -1
          } else {
            return aVal > bVal ? 1 : -1
          }
        })
      }

      // Apply pagination
      const page = parseInt(params.page) || 1
      const limit = parseInt(params.limit) || 10
      const total = filteredData.length
      const totalPages = Math.ceil(total / limit)
      const from = (page - 1) * limit + 1
      const to = Math.min(page * limit, total)
      
      const paginatedData = filteredData.slice((page - 1) * limit, page * limit)

      return {
        data: {
          success: true,
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages,
            total,
            limit,
            from,
            to,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
          }
        }
      }
    } catch (error) {
      throw error
    }
  },

  // Delete item
  async deleteItem(id, type = 'content') {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In real app, this would be: await api.delete(`/${type}/${id}`)
      console.log(`Deleting ${type} with id:`, id)
      
      return {
        data: {
          success: true,
          message: `${type} berhasil dihapus`
        }
      }
    } catch (error) {
      throw error
    }
  },

  // Update item status
  async updateItemStatus(id, status, type = 'content') {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In real app, this would be: await api.patch(`/${type}/${id}`, { status })
      console.log(`Updating ${type} ${id} status to:`, status)
      
      return {
        data: {
          success: true,
          message: `Status ${type} berhasil diubah`
        }
      }
    } catch (error) {
      throw error
    }
  }
}

// Utility function to get nested value
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Table configuration helpers
export const tableConfigs = {
  content: {
    columns: [
      {
        key: 'title',
        label: 'Judul',
        sortable: true,
        class: 'font-medium text-gray-900'
      },
      {
        key: 'category',
        label: 'Kategori',
        sortable: true
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        sortable: true,
        badgeOptions: {
          published: 'bg-green-100 text-green-800',
          draft: 'bg-gray-100 text-gray-800',
          pending: 'bg-yellow-100 text-yellow-800'
        }
      },
      {
        key: 'author',
        label: 'Penulis',
        sortable: true
      },
      {
        key: 'views',
        label: 'Views',
        sortable: true,
        align: 'right'
      },
      {
        key: 'updatedAt',
        label: 'Terakhir Diupdate',
        type: 'date',
        sortable: true
      }
    ],
    defaultSort: { column: 'updatedAt', order: 'desc' },
    defaultLimit: 10
  },
  
  users: {
    columns: [
      {
        key: 'name',
        label: 'Nama',
        sortable: true,
        class: 'font-medium text-gray-900'
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true
      },
      {
        key: 'role',
        label: 'Role',
        sortable: true,
        type: 'badge',
        badgeOptions: {
          admin: 'bg-red-100 text-red-800',
          editor: 'bg-blue-100 text-blue-800',
          viewer: 'bg-green-100 text-green-800'
        }
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        sortable: true,
        badgeOptions: {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800'
        }
      },
      {
        key: 'lastLogin',
        label: 'Login Terakhir',
        type: 'date',
        sortable: true
      }
    ],
    defaultSort: { column: 'name', order: 'asc' },
    defaultLimit: 10
  }
}
