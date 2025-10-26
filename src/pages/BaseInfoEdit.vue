<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="sidebarOpen = false"
    >
      <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col lg:shadow-none lg:border-r lg:border-gray-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center">
          <div class="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <span class="text-lg font-bold text-gray-900 font-display">Scaffolding</span>
            <p class="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-6 overflow-y-auto">
        <div class="space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            @click="closeSidebarOnRouteChange"
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer',
              item.current
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                'mr-3 h-5 w-5 flex-shrink-0',
                item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
              ]"
            />
            {{ item.name }}
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="flex-1 min-w-0">
      <!-- Top header -->
      <AppHeader
        :title="isEdit ? 'Edit Base Information' : 'Add Base Information'"
        @toggle-sidebar="sidebarOpen = true"
      />

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <div class="mb-6">
            <Breadcrumb :items="breadcrumbItems" />
          </div>

          <!-- Form -->
          <form @submit.prevent="saveBaseInfo" class="space-y-8">
            <!-- Basic Information -->
            <div class="card">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Base Information</h3>
                <div class="flex space-x-3">
                  <router-link
                    to="/base-info"
                    class="btn-secondary"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Cancel
                  </router-link>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn-primary"
                  >
                    <svg v-if="loading" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ loading ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="mb-6">
                <ErrorMessage :message="error" @dismiss="error = ''" />
              </div>

              <div class="space-y-6">
                <!-- Phone -->
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    required
                    class="input-field"
                    placeholder="e.g., +852 2345 6789"
                  />
                  <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="input-field"
                    placeholder="e.g., info@scaffolding.com.hk"
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                </div>

                <!-- WhatsApp -->
                <div>
                  <label for="whatsapp" class="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    id="whatsapp"
                    v-model="form.whatsapp"
                    type="tel"
                    required
                    class="input-field"
                    placeholder="e.g., +852 9876 5432"
                  />
                  <p v-if="errors.whatsapp" class="mt-1 text-sm text-red-600">{{ errors.whatsapp }}</p>
                </div>

                <!-- Footer -->
                <div>
                  <label for="footer" class="block text-sm font-medium text-gray-700 mb-2">
                    Footer Text *
                  </label>
                  <textarea
                    id="footer"
                    v-model="form.footer"
                    rows="2"
                    required
                    class="input-field"
                    placeholder="e.g., © 2025 Scaffolding Engineering Limited. All rights reserved."
                  ></textarea>
                  <p v-if="errors.footer" class="mt-1 text-sm text-red-600">{{ errors.footer }}</p>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Preview</h3>

              <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div class="space-y-4">
                  <!-- Contact Information -->
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">Contact Information:</div>
                    <div class="flex items-center space-x-4">
                      <div v-if="form.phone" class="flex items-center space-x-1">
                        <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <span class="text-sm font-medium">{{ form.phone }}</span>
                      </div>

                      <div v-if="form.email" class="flex items-center space-x-1">
                        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-sm font-medium">{{ form.email }}</span>
                      </div>

                      <div v-if="form.whatsapp" class="flex items-center space-x-1">
                        <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <span class="text-sm font-medium">{{ form.whatsapp }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Footer Preview -->
                  <div class="border-t pt-4">
                    <div class="text-center">
                      <p class="text-sm text-gray-600 italic">{{ form.footer || 'Footer text will appear here' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Information Box -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-blue-800">
                    <strong>Base Information:</strong> This information will be displayed in the website footer and contact sections. It includes essential contact details that visitors can use to reach your company.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import { baseInfoApi } from '../services/scaffoldingApi.js'
import { useNavigation } from '../composables/useNavigation.js'

export default {
  name: 'BaseInfoEdit',
  components: {
    AppHeader,
    Breadcrumb,
    ErrorMessage
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { navigation, getNavigationLink } = useNavigation()

    const sidebarOpen = ref(false)
    const loading = ref(false)
    const error = ref('')
    const errors = ref({})

    // Form data
    const form = ref({
      phone: '',
      email: '',
      whatsapp: '',
      footer: ''
    })

    // Check if editing existing item
    const isEdit = computed(() => !!route.params.id)

    // Breadcrumb items
    const breadcrumbItems = computed(() => [
      {
        name: 'Dashboard',
        to: '/dashboard'
      },
      {
        name: 'Base Info',
        to: '/base-info'
      },
      {
        name: isEdit.value ? 'Edit' : 'Add',
        to: null
      }
    ])

    // Close sidebar when route changes (mobile)
    const closeSidebarOnRouteChange = () => {
      if (window.innerWidth < 1024) {
        sidebarOpen.value = false
      }
    }

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        sidebarOpen.value = false
      }
    }

    // Add event listeners
    window.addEventListener('resize', handleResize)

    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    // Validate form
    const validateForm = () => {
      errors.value = {}
      let isValid = true

      if (!form.value.phone.trim()) {
        errors.value.phone = 'Phone number is required'
        isValid = false
      }

      if (!form.value.email.trim()) {
        errors.value.email = 'Email address is required'
        isValid = false
      } else if (!isValidEmail(form.value.email)) {
        errors.value.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!form.value.whatsapp.trim()) {
        errors.value.whatsapp = 'WhatsApp number is required'
        isValid = false
      }

      if (!form.value.footer.trim()) {
        errors.value.footer = 'Footer text is required'
        isValid = false
      }

      return isValid
    }

    // Validate email
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    // Load existing data if editing
    const loadBaseInfo = async () => {
      if (!isEdit.value) return

      loading.value = true
      error.value = ''

      try {
        const response = await baseInfoApi.getById(route.params.id)
        form.value = response.data.data
      } catch (err) {
        console.error('Error loading base info:', err)
        error.value = 'Failed to load base information. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Save base info
    const saveBaseInfo = async () => {
      if (!validateForm()) return

      loading.value = true
      error.value = ''

      try {
        if (isEdit.value) {
          await baseInfoApi.update(route.params.id, form.value)
        } else {
          await baseInfoApi.create(form.value)
        }

        router.push('/base-info')
      } catch (err) {
        console.error('Error saving base info:', err)
        error.value = 'Failed to save base information. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Load data on mount
    onMounted(() => {
      loadBaseInfo()
    })

    return {
      sidebarOpen,
      navigation,
      loading,
      error,
      errors,
      form,
      isEdit,
      breadcrumbItems,
      closeSidebarOnRouteChange,
      getNavigationLink,
      validateForm,
      isValidEmail,
      saveBaseInfo
    }
  }
}
</script>