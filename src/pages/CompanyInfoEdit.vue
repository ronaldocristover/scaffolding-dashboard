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
        :title="isEdit ? 'Edit Company Information' : 'Add Company Information'"
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
          <form @submit.prevent="saveCompanyInfo" class="space-y-8">
            <!-- Basic Information -->
            <div class="card">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Company Information</h3>
                <div class="flex space-x-3">
                  <router-link
                    to="/company-info"
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
                <!-- Company Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="input-field"
                    placeholder="Enter company name"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <!-- Title -->
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    required
                    class="input-field"
                    placeholder="Enter company title"
                  />
                  <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                </div>

                <!-- Subtitle -->
                <div>
                  <label for="subtitle" class="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle *
                  </label>
                  <input
                    id="subtitle"
                    v-model="form.subtitle"
                    type="text"
                    required
                    class="input-field"
                    placeholder="Enter company subtitle"
                  />
                  <p v-if="errors.subtitle" class="mt-1 text-sm text-red-600">{{ errors.subtitle }}</p>
                </div>

                <!-- Logo -->
                <div>
                  <label for="logo" class="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    id="logo"
                    v-model="form.logo"
                    type="url"
                    class="input-field"
                    placeholder="Enter logo URL (optional)"
                  />
                  <p v-if="errors.logo" class="mt-1 text-sm text-red-600">{{ errors.logo }}</p>

                  <!-- Logo Preview -->
                  <div v-if="form.logo" class="mt-3">
                    <p class="text-sm text-gray-600 mb-2">Logo Preview:</p>
                    <img
                      :src="form.logo"
                      alt="Logo preview"
                      class="h-16 w-auto rounded border border-gray-200"
                      @error="handleImageError"
                    />
                  </div>
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
import { companyInfoApi } from '../services/scaffoldingApi.js'
import { useNavigation } from '../composables/useNavigation.js'

export default {
  name: 'CompanyInfoEdit',
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
      name: '',
      title: '',
      subtitle: '',
      logo: ''
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
        name: 'Company Information',
        to: '/company-info'
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

      if (!form.value.name.trim()) {
        errors.value.name = 'Company name is required'
        isValid = false
      }

      if (!form.value.title.trim()) {
        errors.value.title = 'Title is required'
        isValid = false
      }

      if (!form.value.subtitle.trim()) {
        errors.value.subtitle = 'Subtitle is required'
        isValid = false
      }

      if (form.value.logo && !isValidUrl(form.value.logo)) {
        errors.value.logo = 'Please enter a valid URL'
        isValid = false
      }

      return isValid
    }

    // Check if URL is valid
    const isValidUrl = (url) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }

    // Handle image error
    const handleImageError = () => {
      console.warn('Failed to load logo image')
    }

    // Load existing data if editing
    const loadCompanyInfo = async () => {
      if (!isEdit.value) return

      loading.value = true
      error.value = ''

      try {
        const response = await companyInfoApi.getById(route.params.id)
        form.value = response.data.data
      } catch (err) {
        console.error('Error loading company info:', err)
        error.value = 'Failed to load company information. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Save company info
    const saveCompanyInfo = async () => {
      if (!validateForm()) return

      loading.value = true
      error.value = ''

      try {
        if (isEdit.value) {
          await companyInfoApi.update(route.params.id, form.value)
        } else {
          await companyInfoApi.create(form.value)
        }

        router.push('/company-info')
      } catch (err) {
        console.error('Error saving company info:', err)
        error.value = 'Failed to save company information. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Load data on mount
    onMounted(() => {
      loadCompanyInfo()
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
      handleImageError,
      saveCompanyInfo
    }
  }
}
</script>