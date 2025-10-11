<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h1 class="mt-6 text-2xl font-bold text-gray-900 font-display">
          Scaffolding Dashboard
        </h1>
        <h2 class="mt-2 text-xl font-semibold text-gray-700">
          Selamat Datang
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Masuk ke dashboard Anda
        </p>
      </div>

      <!-- Login Form Card -->
      <div class="card">
        <!-- Error Message -->
        <ErrorMessage 
          v-if="error" 
          :message="error" 
          type="error" 
          dismissible 
          @dismiss="error = ''"
        />
        
        <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="Masukkan email Anda"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="Masukkan password Anda"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              Ingat saya
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
              Lupa password?
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </div>

        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
          <p class="text-xs text-blue-700">Email: admin@demo.com</p>
          <p class="text-xs text-blue-700">Password: password123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService, handleApiError, validateForm } from '../services/auth'
import ErrorMessage from '../components/ErrorMessage.vue'

export default {
  name: 'Login',
  components: {
    ErrorMessage
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const form = ref({
      email: '',
      password: '',
      remember: false
    })

    const handleLogin = async () => {
      // Clear previous error
      error.value = ''
      
      // Validate form
      const validation = validateForm(form.value)
      if (!validation.isValid) {
        error.value = Object.values(validation.errors)[0]
        return
      }

      loading.value = true
      
      try {
        const response = await authService.login(form.value)
        
        if (response.data.success) {
          // Store auth data
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('authToken', response.data.data.token)
          localStorage.setItem('userEmail', response.data.data.user.email)
          localStorage.setItem('userName', response.data.data.user.name)
          
          // Redirect to dashboard
          router.push('/dashboard')
        }
      } catch (err) {
        error.value = handleApiError(err)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>
