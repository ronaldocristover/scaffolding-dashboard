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
        title="Banner Management"
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
                  placeholder="Search banners..."
                  class="input-field pl-10"
                />
              </div>
            </div>
            <router-link
              to="/banner/create"
              class="btn-primary"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Banner
            </router-link>
          </div>
        </div>

        <!-- Banner List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Banners</h3>
              <p class="text-sm text-gray-500 mt-1">{{ filteredBanners.length }} records</p>
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
            <ErrorMessage :message="error" @retry="loadBanners" />
          </div>

          <!-- Data Grid -->
          <div v-else class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="banner in paginatedBanners"
                :key="banner.id"
                class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <!-- Banner Images -->
                <div class="aspect-video bg-gray-100 relative">
                  <div v-if="banner.images && banner.images.length > 0" class="relative h-full">
                    <img
                      :src="banner.images[0]"
                      :alt="banner.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-if="banner.images.length > 1" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      +{{ banner.images.length - 1 }} more
                    </div>
                  </div>
                  <div v-else class="flex items-center justify-center h-full">
                    <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>

                <!-- Banner Content -->
                <div class="p-4">
                  <h4 class="font-medium text-gray-900 mb-1 line-clamp-1">{{ banner.title }}</h4>
                  <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ banner.subtitle }}</p>
                  <p class="text-xs text-gray-500 mb-3 line-clamp-2">{{ banner.content }}</p>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">
                      {{ formatDate(banner.createdAt) }}
                    </span>
                    <div class="flex space-x-2">
                      <router-link
                        :to="`/banner/edit/${banner.id}`"
                        class="text-primary-600 hover:text-primary-900 text-sm"
                      >
                        Edit
                      </router-link>
                      <button
                        @click="deleteBanner(banner.id)"
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

          <!-- Empty State -->
          <div v-if="!loading && !error && filteredBanners.length === 0" class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No banners found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating your first banner.</p>
            <div class="mt-6">
              <router-link
                to="/banner/create"
                class="btn-primary"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Banner
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && !error && filteredBanners.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredBanners.length) }} of {{ filteredBanners.length }} results
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
import { bannerApi } from '../services/scaffoldingApi.js'

// Icons as components
const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path></svg>`
}

const ImageIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
}

const CogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`
}

export default {
  name: 'BannerManagement',
  components: {
    HomeIcon,
    ImageIcon,
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
    const bannerList = ref([])

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
        name: 'Banner Management',
        to: '/banner',
        icon: ImageIcon
      }
    ])

    const navigation = ref([
      { name: 'Dashboard', icon: HomeIcon, current: false },
      { name: 'Company Information', icon: ImageIcon, current: false },
      { name: 'Banner', icon: ImageIcon, current: true },
      { name: 'About Company', icon: ImageIcon, current: false },
      { name: 'Quote Price', icon: ImageIcon, current: false },
      { name: 'Contact Info', icon: ImageIcon, current: false },
      { name: 'Base Info', icon: ImageIcon, current: false },
      { name: 'Settings', icon: CogIcon, current: false }
    ])

    // Load banner data
    const loadBanners = async () => {
      loading.value = true
      error.value = ''
      try {
        const response = await bannerApi.getAll()
        bannerList.value = response.data.data || []
      } catch (err) {
        console.error('Error loading banners:', err)
        error.value = 'Failed to load banners. Please try again.'
        // Use sample data if API fails
        bannerList.value = [
          {
            id: 1,
            title: 'Professional Scaffolding Services',
            subtitle: 'Safe, Reliable, and Efficient Solutions',
            content: 'We provide comprehensive scaffolding solutions for construction projects of all sizes.',
            images: ['/images/banner1.jpg', '/images/banner2.jpg'],
            createdAt: '2025-10-26T04:21:36.568Z',
            updatedAt: '2025-10-26T04:21:36.568Z'
          }
        ]
      } finally {
        loading.value = false
      }
    }

    // Computed properties
    const filteredBanners = computed(() => {
      return bannerList.value.filter(banner => {
        const matchesSearch = !searchQuery.value ||
          banner.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          banner.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          banner.content.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchesSearch
      })
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredBanners.value.length / itemsPerPage.value)
    })

    const paginatedBanners = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredBanners.value.slice(start, end)
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

    const deleteBanner = async (id) => {
      if (confirm('Are you sure you want to delete this banner?')) {
        try {
          await bannerApi.delete(id)
          await loadBanners()
        } catch (err) {
          console.error('Error deleting banner:', err)
          error.value = 'Failed to delete banner. Please try again.'
        }
      }
    }

    // Load data on mount
    onMounted(() => {
      loadBanners()
    })

    return {
      sidebarOpen,
      navigation,
      loading,
      error,
      searchQuery,
      currentPage,
      itemsPerPage,
      bannerList,
      filteredBanners,
      totalPages,
      paginatedBanners,
      breadcrumbItems,
      closeSidebarOnRouteChange,
      getNavigationLink,
      formatDate,
      deleteBanner,
      loadBanners
    }
  }
}
</script>