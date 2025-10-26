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
            :to="getNavigationLink(item.name)"
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
        title="Contact Information Management"
        @toggle-sidebar="sidebarOpen = true"
      />

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <!-- Breadcrumb -->
        <div class="mb-6">
          <Breadcrumb :items="breadcrumbItems" />
        </div>

        <!-- Search and Add -->
        <div class="mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search contact information..."
                  class="input-field pl-10"
                />
              </div>
            </div>
            <router-link
              to="/contact-info/create"
              class="btn-primary"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Contact Info
            </router-link>
          </div>
        </div>

        <!-- Contact Info List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Contact Information</h3>
              <p class="text-sm text-gray-500 mt-1">{{ filteredContactInfo.length }} records</p>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-flex items-center">
              <svg class="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Loading...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8 text-center">
            <ErrorMessage :message="error" @retry="loadContactInfo" />
          </div>

          <!-- Contact Cards -->
          <div v-else class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="item in paginatedContactInfo"
                :key="item.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <!-- Card Header -->
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-1">{{ item.title }}</h4>
                    <p class="text-sm text-gray-600">{{ item.subtitle }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <router-link
                      :to="`/contact-info/edit/${item.id}`"
                      class="text-primary-600 hover:text-primary-900 text-sm"
                    >
                      Edit
                    </router-link>
                    <button
                      @click="deleteContactInfo(item.id)"
                      class="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <!-- Contact Details -->
                <div v-if="item.content" class="space-y-3">
                  <!-- Address -->
                  <div v-if="item.content.address" class="flex items-start space-x-3">
                    <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Address</p>
                      <p class="text-sm text-gray-600">{{ item.content.address }}</p>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div v-if="item.content.phone" class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Phone</p>
                      <p class="text-sm text-gray-600">{{ item.content.phone }}</p>
                    </div>
                  </div>

                  <!-- Email -->
                  <div v-if="item.content.email" class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Email</p>
                      <p class="text-sm text-gray-600">{{ item.content.email }}</p>
                    </div>
                  </div>

                  <!-- Hours -->
                  <div v-if="item.content.hours" class="flex items-start space-x-3">
                    <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700">Business Hours</p>
                      <p class="text-sm text-gray-600">{{ item.content.hours }}</p>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="mt-4 pt-4 border-t border-gray-100">
                  <p class="text-xs text-gray-400">
                    Created {{ formatDate(item.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && !error && filteredContactInfo.length === 0" class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No contact information found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating your first contact information record.</p>
            <div class="mt-6">
              <router-link
                to="/contact-info/create"
                class="btn-primary"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Contact Info
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && !error && filteredContactInfo.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredContactInfo.length) }} of {{ filteredContactInfo.length }} results
              </div>
              <div class="flex space-x-2">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span class="px-3 py-1 text-sm text-gray-700">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import { contactInfoApi } from '../services/scaffoldingApi.js'

// Icons as components
const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path></svg>`
}

const PhoneIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
}

const CogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`
}

export default {
  name: 'ContactInfoManagement',
  components: {
    HomeIcon,
    PhoneIcon,
    CogIcon,
    AppHeader,
    Breadcrumb,
    ErrorMessage
  },
  setup() {
    const router = useRouter()
    const sidebarOpen = ref(false)
    const loading = ref(false)
    const error = ref('')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(9) // Grid layout, show 9 items per page
    const contactInfoList = ref([])

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

    // Breadcrumb items
    const breadcrumbItems = ref([
      {
        name: 'Dashboard',
        to: '/dashboard',
        icon: HomeIcon
      },
      {
        name: 'Contact Information',
        to: '/contact-info',
        icon: PhoneIcon
      }
    ])

    const navigation = ref([
      { name: 'Dashboard', icon: HomeIcon, current: false },
      { name: 'Company Information', icon: PhoneIcon, current: false },
      { name: 'Banner', icon: PhoneIcon, current: false },
      { name: 'About Company', icon: PhoneIcon, current: false },
      { name: 'Quote Price', icon: PhoneIcon, current: false },
      { name: 'Contact Info', icon: PhoneIcon, current: true },
      { name: 'Base Info', icon: PhoneIcon, current: false },
      { name: 'Settings', icon: CogIcon, current: false }
    ])

    // Load contact info data
    const loadContactInfo = async () => {
      loading.value = true
      error.value = ''
      try {
        const response = await contactInfoApi.getAll()
        contactInfoList.value = response.data.data || []
      } catch (err) {
        console.error('Error loading contact info:', err)
        error.value = 'Failed to load contact information. Please try again.'
        // Use sample data if API fails
        contactInfoList.value = [
          {
            id: 1,
            title: 'Contact Us',
            subtitle: 'Get in Touch for Your Scaffolding Needs',
            content: {
              address: '123 Industrial Street, Kwun Tong, Hong Kong',
              phone: '+852 2345 6789',
              email: 'info@scaffolding.com.hk',
              hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM'
            },
            createdAt: '2025-10-26T04:21:36.568Z',
            updatedAt: '2025-10-26T04:21:36.568Z'
          }
        ]
      } finally {
        loading.value = false
      }
    }

    // Computed properties
    const filteredContactInfo = computed(() => {
      return contactInfoList.value.filter(item => {
        const matchesSearch = !searchQuery.value ||
          item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (item.content && (
            item.content.address?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.content.phone?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.content.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
          ))
        return matchesSearch
      })
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredContactInfo.value.length / itemsPerPage.value)
    })

    const paginatedContactInfo = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredContactInfo.value.slice(start, end)
    })

    // Methods
    const formatDate = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(dateString))
    }

    const getNavigationLink = (name) => {
      const links = {
        'Dashboard': '/dashboard',
        'Company Information': '/company-info',
        'Banner': '/banner',
        'About Company': '/about-company',
        'Quote Price': '/quote-price',
        'Contact Info': '/contact-info',
        'Base Info': '/base-info'
      }
      return links[name] || '#'
    }

    const deleteContactInfo = async (id) => {
      if (confirm('Are you sure you want to delete this contact information?')) {
        try {
          await contactInfoApi.delete(id)
          await loadContactInfo()
        } catch (err) {
          console.error('Error deleting contact info:', err)
          error.value = 'Failed to delete contact information. Please try again.'
        }
      }
    }

    // Load data on mount
    onMounted(() => {
      loadContactInfo()
    })

    return {
      sidebarOpen,
      navigation,
      loading,
      error,
      searchQuery,
      currentPage,
      itemsPerPage,
      contactInfoList,
      filteredContactInfo,
      totalPages,
      paginatedContactInfo,
      breadcrumbItems,
      closeSidebarOnRouteChange,
      getNavigationLink,
      formatDate,
      deleteContactInfo,
      loadContactInfo
    }
  }
}
</script>