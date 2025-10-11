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
        title="Profil Saya"
        @toggle-sidebar="sidebarOpen = true"
      />

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <div class="mb-6">
            <Breadcrumb :items="breadcrumbItems" />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Profile Info -->
            <div class="lg:col-span-1">
              <div class="card">
                <div class="text-center">
                  <div class="mx-auto h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <span class="text-2xl font-bold text-primary-700">
                      {{ userInitials }}
                    </span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ userName }}</h3>
                  <p class="text-sm text-gray-500">{{ userEmail }}</p>
                  <p class="text-xs text-gray-400 mt-1">Member sejak {{ memberSince }}</p>
                </div>

                <div class="mt-6 space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Status</span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Role</span>
                    <span class="text-sm font-medium text-gray-900">Administrator</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Last Login</span>
                    <span class="text-sm text-gray-500">{{ lastLogin }}</span>
                  </div>
                </div>

                <div class="mt-6">
                  <Button
                    text="Ubah Foto Profil"
                    variant="secondary"
                    size="sm"
                    icon="user"
                    @click="changeProfilePicture"
                  />
                </div>
              </div>
            </div>

            <!-- Profile Settings -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Personal Information -->
              <div class="card">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Informasi Personal</h3>
                  <Button
                    text="Edit"
                    variant="secondary"
                    size="sm"
                    icon="edit"
                    @click="editPersonalInfo"
                  />
                </div>

                <form @submit.prevent="savePersonalInfo" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                        Nama Depan
                      </label>
                      <input
                        id="firstName"
                        v-model="personalInfo.firstName"
                        type="text"
                        class="input-field"
                        :disabled="!editingPersonalInfo"
                      />
                    </div>
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                        Nama Belakang
                      </label>
                      <input
                        id="lastName"
                        v-model="personalInfo.lastName"
                        type="text"
                        class="input-field"
                        :disabled="!editingPersonalInfo"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      v-model="personalInfo.email"
                      type="email"
                      class="input-field"
                      :disabled="!editingPersonalInfo"
                    />
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      id="phone"
                      v-model="personalInfo.phone"
                      type="tel"
                      class="input-field"
                      :disabled="!editingPersonalInfo"
                    />
                  </div>

                  <div v-if="editingPersonalInfo" class="flex space-x-3">
                    <Button
                      text="Simpan"
                      type="submit"
                      variant="primary"
                      size="sm"
                      :loading="savingPersonalInfo"
                      loading-text="Menyimpan..."
                    />
                    <Button
                      text="Batal"
                      variant="ghost"
                      size="sm"
                      @click="cancelEditPersonalInfo"
                    />
                  </div>
                </form>
              </div>

              <!-- Security Settings -->
              <div class="card">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Keamanan</h3>

                <div class="space-y-4">
                  <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Password</h4>
                      <p class="text-xs text-gray-500">Terakhir diubah 3 bulan yang lalu</p>
                    </div>
                    <Button
                      text="Ubah Password"
                      variant="secondary"
                      size="sm"
                      @click="changePassword"
                    />
                  </div>

                  <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p class="text-xs text-gray-500">Tidak aktif</p>
                    </div>
                    <Button
                      text="Aktifkan"
                      variant="secondary"
                      size="sm"
                      @click="enable2FA"
                    />
                  </div>

                  <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Sesi Aktif</h4>
                      <p class="text-xs text-gray-500">2 perangkat</p>
                    </div>
                    <Button
                      text="Kelola"
                      variant="secondary"
                      size="sm"
                      @click="manageSessions"
                    />
                  </div>
                </div>
              </div>

              <!-- Preferences -->
              <div class="card">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Preferensi</h3>

                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Bahasa</h4>
                      <p class="text-xs text-gray-500">Bahasa tampilan aplikasi</p>
                    </div>
                    <select v-model="preferences.language" class="input-field w-32">
                      <option value="id">Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Timezone</h4>
                      <p class="text-xs text-gray-500">Zona waktu untuk tampilan</p>
                    </div>
                    <select v-model="preferences.timezone" class="input-field w-48">
                      <option value="WIB">WIB (UTC+7)</option>
                      <option value="WITA">WITA (UTC+8)</option>
                      <option value="WIT">WIT (UTC+9)</option>
                    </select>
                  </div>

                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p class="text-xs text-gray-500">Terima notifikasi via email</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="preferences.emailNotifications"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div class="mt-6">
                  <Button
                    text="Simpan Preferensi"
                    variant="primary"
                    size="sm"
                    :loading="savingPreferences"
                    loading-text="Menyimpan..."
                    @click="savePreferences"
                  />
                </div>
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
import Button from '../components/Button.vue'

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

const UserIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`
}

export default {
  name: 'Profile',
  components: {
    HomeIcon,
    UsersIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    CogIcon,
    ContentIcon,
    UserIcon,
    AppHeader,
    Breadcrumb,
    Button
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

    const userName = localStorage.getItem('userName') || 'User'
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com'
    const userInitials = computed(() => {
      return userName.split(' ').map(n => n[0]).join('').toUpperCase()
    })

    // Breadcrumb items
    const breadcrumbItems = ref([
      {
        name: 'Dashboard',
        to: '/dashboard',
        icon: HomeIcon
      },
      {
        name: 'Profil Saya',
        to: '/profile',
        icon: UserIcon
      }
    ])

    const navigation = ref([
      { name: 'Dashboard', icon: HomeIcon, current: false },
      { name: 'Users', icon: UsersIcon, current: false },
      { name: 'Orders', icon: ShoppingCartIcon, current: false },
      { name: 'Analytics', icon: ChartBarIcon, current: false },
      { name: 'Manajemen Konten', icon: ContentIcon, current: false },
      { name: 'Profil Saya', icon: UserIcon, current: true },
      { name: 'Settings', icon: CogIcon, current: false }
    ])

    // Profile data
    const personalInfo = ref({
      firstName: 'John',
      lastName: 'Doe',
      email: userEmail,
      phone: '+62 812 3456 7890'
    })

    const preferences = ref({
      language: 'id',
      timezone: 'WIB',
      emailNotifications: true
    })

    // State
    const editingPersonalInfo = ref(false)
    const savingPersonalInfo = ref(false)
    const savingPreferences = ref(false)

    // Computed
    const memberSince = 'Januari 2024'
    const lastLogin = '2 jam yang lalu'

    // Methods
    const getNavigationLink = (name) => {
      switch (name) {
        case 'Dashboard':
          return '/dashboard'
        case 'Manajemen Konten':
          return '/content'
        case 'Profil Saya':
          return '/profile'
        default:
          return '#'
      }
    }

    const changeProfilePicture = () => {
      console.log('Change profile picture')
    }

    const editPersonalInfo = () => {
      editingPersonalInfo.value = true
    }

    const cancelEditPersonalInfo = () => {
      editingPersonalInfo.value = false
    }

    const savePersonalInfo = async () => {
      savingPersonalInfo.value = true
      
      // Simulate API call
      setTimeout(() => {
        console.log('Saving personal info:', personalInfo.value)
        savingPersonalInfo.value = false
        editingPersonalInfo.value = false
      }, 1000)
    }

    const changePassword = () => {
      console.log('Change password')
    }

    const enable2FA = () => {
      console.log('Enable 2FA')
    }

    const manageSessions = () => {
      console.log('Manage sessions')
    }

    const savePreferences = async () => {
      savingPreferences.value = true
      
      // Simulate API call
      setTimeout(() => {
        console.log('Saving preferences:', preferences.value)
        savingPreferences.value = false
      }, 1000)
    }

    return {
      sidebarOpen,
      userName,
      userEmail,
      userInitials,
      navigation,
      breadcrumbItems,
      personalInfo,
      preferences,
      editingPersonalInfo,
      savingPersonalInfo,
      savingPreferences,
      memberSince,
      lastLogin,
      closeSidebarOnRouteChange,
      getNavigationLink,
      changeProfilePicture,
      editPersonalInfo,
      cancelEditPersonalInfo,
      savePersonalInfo,
      changePassword,
      enable2FA,
      manageSessions,
      savePreferences
    }
  }
}
</script>
