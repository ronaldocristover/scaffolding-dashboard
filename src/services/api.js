import axios from 'axios'

// Create axios instance
const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // Dummy API for testing
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('isAuthenticated')
                    localStorage.removeItem('userEmail')
                    localStorage.removeItem('userName')
                    window.location.href = '/login'
                    break
                case 403:
                    console.error('Access forbidden')
                    break
                case 404:
                    console.error('Resource not found')
                    break
                case 500:
                    console.error('Internal server error')
                    break
                default:
                    console.error('API Error:', data?.message || 'Unknown error')
            }
        } else if (error.request) {
            // Network error
            console.error('Network error:', error.message)
        } else {
            // Other error
            console.error('Error:', error.message)
        }

        return Promise.reject(error)
    }
)

export default api
