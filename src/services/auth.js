import api from './api'

// Auth service
export const authService = {
    // Login
    async login(credentials) {
        try {
            // For demo purposes, we'll simulate API call with dummy data
            // In real app, this would be: const response = await api.post('/auth/login', credentials)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock validation
            if (credentials.email === 'admin@demo.com' && credentials.password === 'password123') {
                const mockResponse = {
                    data: {
                        success: true,
                        message: 'Login berhasil',
                        data: {
                            user: {
                                id: 1,
                                name: 'Admin User',
                                email: credentials.email,
                                role: 'admin'
                            },
                            token: 'mock-jwt-token-12345'
                        }
                    }
                }
                return mockResponse
            } else {
                throw new Error('Email atau password salah')
            }
        } catch (error) {
            throw error
        }
    },

    // Forgot Password
    async forgotPassword(email) {
        try {
            // For demo purposes, we'll simulate API call
            // In real app, this would be: const response = await api.post('/auth/forgot-password', { email })

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Mock validation
            if (email && email.includes('@')) {
                const mockResponse = {
                    data: {
                        success: true,
                        message: 'Link reset password telah dikirim ke email Anda'
                    }
                }
                return mockResponse
            } else {
                throw new Error('Email tidak valid')
            }
        } catch (error) {
            throw error
        }
    },

    // Logout
    async logout() {
        try {
            // In real app, this would be: await api.post('/auth/logout')
            localStorage.removeItem('authToken')
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userName')
            return { success: true, message: 'Logout berhasil' }
        } catch (error) {
            throw error
        }
    },

    // Verify Token
    async verifyToken() {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) {
                throw new Error('No token found')
            }

            // In real app, this would be: const response = await api.get('/auth/verify')
            return { success: true, valid: true }
        } catch (error) {
            throw error
        }
    }
}

// Error handler utility
export const handleApiError = (error) => {
    let message = 'Terjadi kesalahan. Silakan coba lagi.'

    if (error.response) {
        // Server error
        const { status, data } = error.response
        message = data?.message || `Error ${status}: ${getStatusMessage(status)}`
    } else if (error.request) {
        // Network error
        message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (error.message) {
        // Custom error message
        message = error.message
    }

    return message
}

// Get status message
const getStatusMessage = (status) => {
    const messages = {
        400: 'Permintaan tidak valid',
        401: 'Email atau password salah',
        403: 'Akses ditolak',
        404: 'Data tidak ditemukan',
        422: 'Data tidak valid',
        500: 'Server error',
        503: 'Server sedang maintenance'
    }
    return messages[status] || 'Terjadi kesalahan'
}

// Validation utilities
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const validatePassword = (password) => {
    return password && password.length >= 6
}

export const validateForm = (fields) => {
    const errors = {}

    if (fields.email && !validateEmail(fields.email)) {
        errors.email = 'Format email tidak valid'
    }

    if (fields.password && !validatePassword(fields.password)) {
        errors.password = 'Password minimal 6 karakter'
    }

    if (fields.confirmPassword && fields.password !== fields.confirmPassword) {
        errors.confirmPassword = 'Password tidak sama'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}
