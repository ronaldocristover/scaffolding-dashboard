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
        title="About Company Management"
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
                  placeholder="Search about company content..."
                  class="input-field pl-10"
                />
              </div>
            </div>
            <router-link
              to="/about-company/create"
              class="btn-primary"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add About Company
            </router-link>
          </div>
        </div>

        <!-- About Company List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">About Company Content</h3>
              <p class="text-sm text-gray-500 mt-1">{{ filteredAboutCompany.length }} records</p>
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
            <ErrorMessage :message="error" @retry="loadAboutCompany" />
          </div>

          <!-- Data List -->
          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="item in paginatedAboutCompany"
              :key="item.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-start space-x-4">
                <!-- Main Image -->
                <div class="flex-shrink-0">
                  <div v-if="item.images?.main" class="h-16 w-16 rounded-lg overflow-hidden">
                    <img
                      :src="item.images.main"
                      :alt="item.title"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div v-else class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="text-lg font-medium text-gray-900 mb-1">{{ item.title }}</h4>
                      <p class="text-sm text-gray-600 mb-2">{{ item.subtitle }}</p>
                      <p class="text-sm text-gray-500 line-clamp-3">{{ item.content }}</p>

                      <!-- Gallery Images -->
                      <div v-if="item.images?.gallery && item.images.gallery.length > 0" class="mt-3 flex items-center space-x-2">
                        <span class="text-xs text-gray-400">Gallery:</span>
                        <div class="flex space-x-1">
                          <img
                            v-for="(img, index) in item.images.gallery.slice(0, 3)"
                            :key="index"
                            :src="img"
                            :alt="`Gallery image ${index + 1}`"
                            class="h-6 w-6 rounded object-cover"
                          />
                          <div v-if="item.images.gallery.length > 3" class="h-6 w-6 bg-gray-200 rounded flex items-center justify-center">
                            <span class="text-xs text-gray-600">+{{ item.images.gallery.length - 3 }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col items-end space-y-2 ml-4">
                      <span class="text-xs text-gray-400">
                        {{ formatDate(item.createdAt) }}
                      </span>
                      <div class="flex space-x-2">
                        <router-link
                          :to="`/about-company/edit/${item.id}`"
                          class="text-primary-600 hover:text-primary-900 text-sm"
                        >
                          Edit
                        </router-link>
                        <button
                          @click="deleteAboutCompany(item.id)"
                          class="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && !error && filteredAboutCompany.length === 0" class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No about company content found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating your first about company content.</p>
            <div class="mt-6">
              <router-link
                to="/about-company/create"
                class="btn-primary"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add About Company
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && !error && filteredAboutCompany.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredAboutCompany.length) }} of {{ filteredAboutCompany.length }} results
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
import { aboutCompanyApi } from '../services/scaffoldingApi.js'

// Icons as components
const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path></svg>`
}

const BuildingIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`
}

const CogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`
}

export default {
  name: 'AboutCompanyManagement',
  components: {
    HomeIcon,
    BuildingIcon,
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
    const itemsPerPage = ref(10)
    const aboutCompanyList = ref([])

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
        name: 'About Company',
        to: '/about-company',
        icon: BuildingIcon
      }
    ])

    const navigation = ref([
      { name: 'Dashboard', icon: HomeIcon, current: false },
      { name: 'Company Information', icon: BuildingIcon, current: false },
      { name: 'Banner', icon: BuildingIcon, current: false },
      { name: 'About Company', icon: BuildingIcon, current: true },
      { name: 'Quote Price', icon: BuildingIcon, current: false },
      { name: 'Contact Info', icon: BuildingIcon, current: false },
      { name: 'Base Info', icon: BuildingIcon, current: false },
      { name: 'Settings', icon: CogIcon, current: false }
    ])

    // Load about company data
    const loadAboutCompany = async () => {
      loading.value = true
      error.value = ''
      try {
        const response = await aboutCompanyApi.getAll()
        aboutCompanyList.value = response.data.data || []
      } catch (err) {
        console.error('Error loading about company:', err)
        error.value = 'Failed to load about company content. Please try again.'
        // Use sample data if API fails
        aboutCompanyList.value = [
          {
            id: 1,
            title: 'About Scaffolding Engineering Limited',
            subtitle: 'Your Trusted Scaffolding Partner Since 2010',
            content: 'With over a decade of experience in the scaffolding industry, we have established ourselves as a leading provider of safe and reliable scaffolding solutions in Hong Kong.',
            images: {
              main: '/images/about-main.jpg',
              gallery: ['/images/gallery1.jpg', '/images/gallery2.jpg']
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
    const filteredAboutCompany = computed(() => {
      return aboutCompanyList.value.filter(item => {
        const matchesSearch = !searchQuery.value ||
          item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchesSearch
      })
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredAboutCompany.value.length / itemsPerPage.value)
    })

    const paginatedAboutCompany = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredAboutCompany.value.slice(start, end)
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

    const deleteAboutCompany = async (id) => {
      if (confirm('Are you sure you want to delete this about company content?')) {
        try {
          await aboutCompanyApi.delete(id)
          await loadAboutCompany()
        } catch (err) {
          console.error('Error deleting about company:', err)
          error.value = 'Failed to delete about company content. Please try again.'
        }
      }
    }

    // Load data on mount
    onMounted(() => {
      loadAboutCompany()
    })

    return {
      sidebarOpen,
      navigation,
      loading,
      error,
      searchQuery,
      currentPage,
      itemsPerPage,
      aboutCompanyList,
      filteredAboutCompany,
      totalPages,
      paginatedAboutCompany,
      breadcrumbItems,
      closeSidebarOnRouteChange,
      getNavigationLink,
      formatDate,
      deleteAboutCompany,
      loadAboutCompany
    }
  }
}
</script>