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
        :title="isEdit ? 'Edit Quote Price' : 'Add Quote Price'"
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
          <form @submit.prevent="saveQuotePrice" class="space-y-8">
            <!-- Basic Information -->
            <div class="card">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Quote Information</h3>
                <div class="flex space-x-3">
                  <router-link
                    to="/quote-price"
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
                    placeholder="Enter quote title"
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
                    placeholder="Enter quote subtitle"
                  />
                  <p v-if="errors.subtitle" class="mt-1 text-sm text-red-600">{{ errors.subtitle }}</p>
                </div>
              </div>
            </div>

            <!-- Pricing Services -->
            <div class="card">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Pricing Services</h3>
                <button
                  type="button"
                  @click="addService"
                  class="btn-primary"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Service
                </button>
              </div>

              <div v-if="form.content.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-500">No services added yet. Click "Add Service" to get started.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="(service, index) in form.content"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-4">
                    <h4 class="font-medium text-gray-900">Service {{ index + 1 }}</h4>
                    <button
                      type="button"
                      @click="removeService(index)"
                      class="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Service Name -->
                    <div>
                      <label :for="`service-${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                        Service Name *
                      </label>
                      <input
                        :id="`service-${index}`"
                        v-model="service.service"
                        type="text"
                        required
                        class="input-field"
                        placeholder="e.g., Basic Scaffolding"
                      />
                      <p v-if="errors[`content.${index}.service`]" class="mt-1 text-sm text-red-600">
                        {{ errors[`content.${index}.service`] }}
                      </p>
                    </div>

                    <!-- Price -->
                    <div>
                      <label :for="`price-${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        :id="`price-${index}`"
                        v-model="service.price"
                        type="text"
                        required
                        class="input-field"
                        placeholder="e.g., Starting from HK$500/day"
                      />
                      <p v-if="errors[`content.${index}.price`]" class="mt-1 text-sm text-red-600">
                        {{ errors[`content.${index}.price`] }}
                      </p>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="mt-4">
                    <label :for="`description-${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      :id="`description-${index}`"
                      v-model="service.description"
                      rows="3"
                      required
                      class="input-field"
                      placeholder="Describe the service in detail"
                    ></textarea>
                    <p v-if="errors[`content.${index}.description`]" class="mt-1 text-sm text-red-600">
                      {{ errors[`content.${index}.description`] }}
                    </p>
                  </div>
                </div>
              </div>

              <p v-if="errors.content" class="mt-2 text-sm text-red-600">{{ errors.content }}</p>
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
import { quotePriceApi } from '../services/scaffoldingApi.js'
import { useNavigation } from '../composables/useNavigation.js'

export default {
  name: 'QuotePriceEdit',
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
      title: '',
      subtitle: '',
      content: []
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
        name: 'Quote Price',
        to: '/quote-price'
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

    // Add new service
    const addService = () => {
      form.value.content.push({
        service: '',
        price: '',
        description: ''
      })
    }

    // Remove service
    const removeService = (index) => {
      form.value.content.splice(index, 1)
    }

    // Validate form
    const validateForm = () => {
      errors.value = {}
      let isValid = true

      if (!form.value.title.trim()) {
        errors.value.title = 'Title is required'
        isValid = false
      }

      if (!form.value.subtitle.trim()) {
        errors.value.subtitle = 'Subtitle is required'
        isValid = false
      }

      if (form.value.content.length === 0) {
        errors.value.content = 'At least one service is required'
        isValid = false
      } else {
        form.value.content.forEach((service, index) => {
          if (!service.service.trim()) {
            errors.value[`content.${index}.service`] = 'Service name is required'
            isValid = false
          }

          if (!service.price.trim()) {
            errors.value[`content.${index}.price`] = 'Price is required'
            isValid = false
          }

          if (!service.description.trim()) {
            errors.value[`content.${index}.description`] = 'Description is required'
            isValid = false
          }
        })
      }

      return isValid
    }

    // Load existing data if editing
    const loadQuotePrice = async () => {
      if (!isEdit.value) return

      loading.value = true
      error.value = ''

      try {
        const response = await quotePriceApi.getById(route.params.id)
        form.value = response.data.data
      } catch (err) {
        console.error('Error loading quote price:', err)
        error.value = 'Failed to load quote price. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Save quote price
    const saveQuotePrice = async () => {
      if (!validateForm()) return

      loading.value = true
      error.value = ''

      try {
        if (isEdit.value) {
          await quotePriceApi.update(route.params.id, form.value)
        } else {
          await quotePriceApi.create(form.value)
        }

        router.push('/quote-price')
      } catch (err) {
        console.error('Error saving quote price:', err)
        error.value = 'Failed to save quote price. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Load data on mount
    onMounted(() => {
      loadQuotePrice()
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
      addService,
      removeService,
      validateForm,
      saveQuotePrice
    }
  }
}
</script>