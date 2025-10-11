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
        title="Manajemen Konten"
        @toggle-sidebar="sidebarOpen = true"
      />

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <!-- Breadcrumb -->
        <div class="mb-6">
          <Breadcrumb :items="breadcrumbItems" />
        </div>

        <!-- Search and Filter -->
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
                  placeholder="Cari konten..."
                  class="input-field pl-10"
                />
              </div>
            </div>
            <div class="flex gap-2">
              <select v-model="selectedCategory" class="input-field">
                <option value="">Semua Kategori</option>
                <option value="artikel">Artikel</option>
                <option value="berita">Berita</option>
                <option value="tutorial">Tutorial</option>
                <option value="produk">Produk</option>
              </select>
              <select v-model="selectedStatus" class="input-field">
                <option value="">Semua Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Content List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Daftar Konten</h3>
              <p class="text-sm text-gray-500 mt-1">{{ filteredContent.length }} dari {{ contentList.length }} konten</p>
            </div>
            <router-link 
              to="/content/edit"
              class="btn-primary"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Tambah Konten
            </router-link>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konten
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="content in paginatedContent" :key="content.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-12 w-12 flex-shrink-0">
                        <img 
                          :src="content.thumbnail" 
                          :alt="content.title"
                          class="h-12 w-12 rounded-lg object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ content.title }}</div>
                        <div class="text-sm text-gray-500 truncate max-w-xs">{{ content.excerpt }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ content.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      content.status === 'published' ? 'bg-green-100 text-green-800' :
                      content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    ]">
                      {{ content.status === 'published' ? 'Published' : 
                         content.status === 'draft' ? 'Draft' : 'Archived' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(content.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <router-link 
                        :to="`/content/edit/${content.id}`"
                        class="text-primary-600 hover:text-primary-900 transition-colors duration-200"
                      >
                        Edit
                      </router-link>
                      <button 
                        @click="toggleStatus(content)"
                        :class="[
                          'transition-colors duration-200',
                          content.status === 'published' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                        ]"
                      >
                        {{ content.status === 'published' ? 'Unpublish' : 'Publish' }}
                      </button>
                      <button 
                        @click="deleteContent(content.id)"
                        class="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} sampai {{ Math.min(currentPage * itemsPerPage, filteredContent.length) }} dari {{ filteredContent.length }} hasil
              </div>
              <div class="flex space-x-2">
                <button 
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <span class="px-3 py-1 text-sm text-gray-700">
                  Halaman {{ currentPage }} dari {{ totalPages }}
                </span>
                <button 
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
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
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import Breadcrumb from '../components/Breadcrumb.vue'

// Icons as components
const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path></svg>`
}

const UsersIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>`
}

const ShoppingCartIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path></svg>`
}

const ChartBarIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`
}

const CogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`
}

const ContentIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
}

export default {
  name: 'ContentManagement',
  components: {
    HomeIcon,
    UsersIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    CogIcon,
    ContentIcon,
    AppHeader,
    Breadcrumb
  },
  setup() {
    const router = useRouter()
    const sidebarOpen = ref(false)
    
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
        name: 'Manajemen Konten',
        to: '/content',
        icon: ContentIcon
      }
    ])

    const navigation = ref([
      { name: 'Dashboard', icon: HomeIcon, current: false },
      { name: 'Users', icon: UsersIcon, current: false },
      { name: 'Orders', icon: ShoppingCartIcon, current: false },
      { name: 'Analytics', icon: ChartBarIcon, current: false },
      { name: 'Manajemen Konten', icon: ContentIcon, current: true },
      { name: 'Settings', icon: CogIcon, current: false }
    ])

    // Content management state
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Sample content data
    const contentList = ref([
      {
        id: 1,
        title: 'Panduan Lengkap Vue.js 3',
        excerpt: 'Belajar Vue.js 3 dari dasar hingga mahir dengan contoh praktis...',
        category: 'tutorial',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Tips Optimasi Website',
        excerpt: 'Cara meningkatkan performa website dengan teknik modern...',
        category: 'artikel',
        status: 'draft',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
        createdAt: new Date('2024-01-14')
      },
      {
        id: 3,
        title: 'Produk Terbaru: Smart Watch',
        excerpt: 'Smart watch dengan fitur kesehatan dan konektivitas canggih...',
        category: 'produk',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        createdAt: new Date('2024-01-13')
      },
      {
        id: 4,
        title: 'Berita Teknologi Terkini',
        excerpt: 'Update terbaru dari dunia teknologi dan inovasi...',
        category: 'berita',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
        createdAt: new Date('2024-01-12')
      }
    ])

    // Computed properties
    const filteredContent = computed(() => {
      return contentList.value.filter(content => {
        const matchesSearch = content.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            content.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = !selectedCategory.value || content.category === selectedCategory.value
        const matchesStatus = !selectedStatus.value || content.status === selectedStatus.value
        
        return matchesSearch && matchesCategory && matchesStatus
      })
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredContent.value.length / itemsPerPage.value)
    })

    const paginatedContent = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredContent.value.slice(start, end)
    })

    // Methods
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }

    const toggleStatus = (content) => {
      content.status = content.status === 'published' ? 'draft' : 'published'
    }

    const getNavigationLink = (name) => {
      switch (name) {
        case 'Dashboard':
          return '/dashboard'
        case 'Manajemen Konten':
          return '/content'
        default:
          return '#'
      }
    }

    const deleteContent = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
        const index = contentList.value.findIndex(content => content.id === id)
        if (index > -1) {
          contentList.value.splice(index, 1)
        }
      }
    }

    return {
      sidebarOpen,
      navigation,
      searchQuery,
      selectedCategory,
      selectedStatus,
      currentPage,
      itemsPerPage,
      contentList,
      filteredContent,
      totalPages,
      paginatedContent,
      breadcrumbItems,
      closeSidebarOnRouteChange,
      getNavigationLink,
      formatDate,
      toggleStatus,
      deleteContent
    }
  }
}
</script>
