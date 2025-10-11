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

      <!-- Navigation - Takes remaining space -->
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
        title="Dashboard"
        @toggle-sidebar="sidebarOpen = true"
      />

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <!-- Breadcrumb -->
        <div class="mb-6">
          <Breadcrumb :items="breadcrumbItems" />
        </div>
        <!-- Stats cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            v-for="stat in stats" 
            :key="stat.name"
            class="card"
          >
            <div class="flex items-center">
              <div :class="['p-3 rounded-lg', stat.bgColor]">
                <component :is="stat.icon" class="h-6 w-6 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ stat.name }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Grafik Penjualan</h3>
            <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p class="text-gray-500">Chart akan ditampilkan di sini</p>
            </div>
          </div>
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
            <div class="space-y-4">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="flex items-center space-x-3"
              >
                <div :class="['p-2 rounded-full', activity.bgColor]">
                  <component :is="activity.icon" class="h-4 w-4 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent orders table -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Pesanan Terbaru</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pesanan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in recentOrders" :key="order.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ order.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ order.customer }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      order.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                      order.status === 'Proses' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {{ order.total.toLocaleString('id-ID') }}
                  </td>
                </tr>
              </tbody>
            </table>
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
  name: 'Dashboard',
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
      }
    ])

    const navigation = ref([
      { name: 'Dashboard', icon: HomeIcon, current: true },
      { name: 'Users', icon: UsersIcon, current: false },
      { name: 'Orders', icon: ShoppingCartIcon, current: false },
      { name: 'Analytics', icon: ChartBarIcon, current: false },
      { name: 'Manajemen Konten', icon: ContentIcon, current: false },
      { name: 'Settings', icon: CogIcon, current: false }
    ])

    const stats = ref([
      {
        name: 'Total Penjualan',
        value: 'Rp 12.5M',
        icon: ChartBarIcon,
        bgColor: 'bg-blue-500'
      },
      {
        name: 'Total Pesanan',
        value: '1,234',
        icon: ShoppingCartIcon,
        bgColor: 'bg-green-500'
      },
      {
        name: 'Total Customer',
        value: '856',
        icon: UsersIcon,
        bgColor: 'bg-purple-500'
      },
      {
        name: 'Conversion Rate',
        value: '3.2%',
        icon: ChartBarIcon,
        bgColor: 'bg-orange-500'
      }
    ])

    const recentActivities = ref([
      {
        id: 1,
        title: 'Pesanan baru #1234',
        time: '2 menit yang lalu',
        icon: ShoppingCartIcon,
        bgColor: 'bg-blue-500'
      },
      {
        id: 2,
        title: 'Customer baru mendaftar',
        time: '5 menit yang lalu',
        icon: UsersIcon,
        bgColor: 'bg-green-500'
      },
      {
        id: 3,
        title: 'Pembayaran diterima',
        time: '10 menit yang lalu',
        icon: ChartBarIcon,
        bgColor: 'bg-purple-500'
      }
    ])

    const recentOrders = ref([
      { id: '1234', customer: 'John Doe', status: 'Selesai', total: 250000 },
      { id: '1235', customer: 'Jane Smith', status: 'Proses', total: 180000 },
      { id: '1236', customer: 'Bob Johnson', status: 'Pending', total: 320000 },
      { id: '1237', customer: 'Alice Brown', status: 'Selesai', total: 150000 }
    ])

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

    const handleLogout = () => {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      router.push('/login')
    }

    return {
      sidebarOpen,
      navigation,
      stats,
      recentActivities,
      recentOrders,
      breadcrumbItems,
      getNavigationLink,
      handleLogout
    }
  }
}
</script>
