<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        </div>
        <h1 class="mt-6 text-2xl font-bold text-gray-900 font-display">
          Lupa Password?
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password
        </p>
      </div>

      <!-- Forgot Password Form Card -->
      <div class="card">
        <!-- Error Message -->
        <ErrorMessage 
          v-if="error" 
          :message="error" 
          type="error" 
          dismissible 
          @dismiss="error = ''"
        />
        
        <form class="space-y-6" @submit.prevent="handleForgotPassword">
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
              {{ loading ? 'Mengirim...' : 'Kirim Link Reset' }}
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="emailSent" class="mt-6 p-4 bg-green-50 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Email Terkirim!
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Kami telah mengirimkan link reset password ke email Anda. Silakan cek inbox atau folder spam.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <router-link 
            to="/login" 
            class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
          >
            <svg class="inline h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Kembali ke Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService, handleApiError, validateEmail } from '../services/auth'
import ErrorMessage from '../components/ErrorMessage.vue'

export default {
  name: 'ForgotPassword',
  components: {
    ErrorMessage
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const emailSent = ref(false)
    const form = ref({
      email: ''
    })

    const handleForgotPassword = async () => {
      // Clear previous error
      error.value = ''
      
      // Validate email
      if (!form.value.email) {
        error.value = 'Email harus diisi'
        return
      }
      
      if (!validateEmail(form.value.email)) {
        error.value = 'Format email tidak valid'
        return
      }

      loading.value = true
      
      try {
        const response = await authService.forgotPassword(form.value.email)
        
        if (response.data.success) {
          emailSent.value = true
          
          // Auto redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
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
      emailSent,
      handleForgotPassword
    }
  }
}
</script>
