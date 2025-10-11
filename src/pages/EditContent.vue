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
        :title="isEdit ? 'Edit Konten' : 'Tambah Konten Baru'"
        @toggle-sidebar="sidebarOpen = true"
      />

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <div class="mb-6">
            <Breadcrumb :items="breadcrumbItems" />
          </div>

          <form @submit.prevent="saveContent" class="space-y-8">
            <!-- Basic Information -->
            <div class="card">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Informasi Dasar</h3>
                <div class="flex space-x-3">
                  <router-link 
                    to="/content"
                    class="btn-secondary"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Kembali
                  </router-link>
                  <button 
                    @click="saveContent"
                    :disabled="loading"
                    class="btn-primary"
                  >
                    <svg v-if="loading" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ loading ? 'Menyimpan...' : 'Simpan' }}
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="lg:col-span-2">
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                    Judul Konten *
                  </label>
                  <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    required
                    class="input-field"
                    placeholder="Masukkan judul konten"
                  />
                </div>

                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="input-field"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="artikel">Artikel</option>
                    <option value="berita">Berita</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="produk">Produk</option>
                  </select>
                </div>

                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    v-model="form.status"
                    class="input-field"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div class="lg:col-span-2">
                  <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
                    Ringkasan
                  </label>
                  <textarea
                    id="excerpt"
                    v-model="form.excerpt"
                    rows="3"
                    class="input-field"
                    placeholder="Masukkan ringkasan konten"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Image Upload -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Gambar Utama</h3>
              
              <div class="space-y-4">
                <!-- Upload Area -->
                <div 
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors duration-200 cursor-pointer"
                  :class="{ 'border-primary-400 bg-primary-50': isDragOver }"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  
                  <div v-if="!form.thumbnail">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">
                      <span class="font-medium text-primary-600 hover:text-primary-500">Klik untuk upload</span>
                      atau drag and drop
                    </p>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF hingga 10MB</p>
                  </div>
                  
                  <div v-else class="space-y-4">
                    <img 
                      :src="form.thumbnail" 
                      alt="Preview"
                      class="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ uploadedFileName }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(uploadedFileSize) }}</p>
                    </div>
                    <button
                      type="button"
                      @click.stop="removeImage"
                      class="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                </div>

                <!-- Upload Progress -->
                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="space-y-2">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Mengupload...</span>
                    <span>{{ uploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: uploadProgress + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Editor -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Konten</h3>
              
              <div class="space-y-4">
                <!-- Toolbar -->
                <div class="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  <button
                    type="button"
                    @click="formatText('bold')"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors duration-200"
                    title="Bold"
                  >
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a1 1 0 011-1h5.5a3.5 3.5 0 013.5 3.5v1a3.5 3.5 0 01-3.5 3.5H6a1 1 0 00-1 1v2a1 1 0 001 1h4.5a3.5 3.5 0 013.5 3.5v1a3.5 3.5 0 01-3.5 3.5H6a1 1 0 01-1-1V4z"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="formatText('italic')"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors duration-200"
                    title="Italic"
                  >
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 000 2h1.5l-3 10H5a1 1 0 100 2h5a1 1 0 100-2H8.5l3-10H13a1 1 0 100-2H8z"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="insertImage"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors duration-200"
                    title="Insert Image"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="insertLink"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors duration-200"
                    title="Insert Link"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                  </button>
                </div>

                <!-- Content Textarea -->
                <div>
                  <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                    Isi Konten *
                  </label>
                  <textarea
                    id="content"
                    v-model="form.content"
                    rows="15"
                    required
                    class="input-field font-mono text-sm"
                    placeholder="Tulis konten Anda di sini..."
                  ></textarea>
                </div>

                <!-- Preview -->
                <div v-if="form.content" class="space-y-2">
                  <button
                    type="button"
                    @click="showPreview = !showPreview"
                    class="text-sm text-primary-600 hover:text-primary-800 transition-colors duration-200"
                  >
                    {{ showPreview ? 'Sembunyikan Preview' : 'Tampilkan Preview' }}
                  </button>
                  <div v-if="showPreview" class="p-4 bg-gray-50 rounded-lg border">
                    <div class="prose max-w-none" v-html="formatContent(form.content)"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SEO Settings -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Pengaturan SEO</h3>
              
              <div class="space-y-4">
                <div>
                  <label for="metaTitle" class="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    id="metaTitle"
                    v-model="form.metaTitle"
                    type="text"
                    class="input-field"
                    placeholder="Judul untuk SEO (opsional)"
                  />
                </div>

                <div>
                  <label for="metaDescription" class="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    v-model="form.metaDescription"
                    rows="3"
                    class="input-field"
                    placeholder="Deskripsi untuk SEO (opsional)"
                  ></textarea>
                </div>

                <div>
                  <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    id="tags"
                    v-model="tagsInput"
                    type="text"
                    class="input-field"
                    placeholder="Masukkan tags, pisahkan dengan koma"
                    @keyup.enter="addTag"
                  />
                  <div v-if="form.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in form.tags"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {{ tag }}
                      <button
                        type="button"
                        @click="removeTag(index)"
                        class="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
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
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
  name: 'EditContent',
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
    const route = useRoute()
    const sidebarOpen = ref(false)
    const loading = ref(false)
    const showPreview = ref(false)
    const isDragOver = ref(false)
    const uploadProgress = ref(0)
    const uploadedFileName = ref('')
    const uploadedFileSize = ref(0)
    const tagsInput = ref('')
    const fileInput = ref(null)
    
    // Check if editing existing content
    const isEdit = computed(() => route.params.id !== undefined)
    
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
    const breadcrumbItems = computed(() => [
      {
        name: 'Dashboard',
        to: '/dashboard',
        icon: HomeIcon
      },
      {
        name: 'Manajemen Konten',
        to: '/content',
        icon: ContentIcon
      },
      {
        name: isEdit.value ? 'Edit Konten' : 'Tambah Konten',
        to: null,
        icon: null
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

    // Form data
    const form = ref({
      title: '',
      excerpt: '',
      category: '',
      status: 'draft',
      content: '',
      thumbnail: '',
      metaTitle: '',
      metaDescription: '',
      tags: []
    })

    // Load existing content if editing
    onMounted(() => {
      if (isEdit.value) {
        // In real app, fetch content by ID
        form.value = {
          title: 'Panduan Lengkap Vue.js 3',
          excerpt: 'Belajar Vue.js 3 dari dasar hingga mahir dengan contoh praktis...',
          category: 'tutorial',
          status: 'published',
          content: '# Vue.js 3\n\nVue.js 3 adalah framework JavaScript yang powerful...',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
          metaTitle: 'Panduan Vue.js 3 - Tutorial Lengkap',
          metaDescription: 'Pelajari Vue.js 3 dari dasar hingga mahir dengan panduan lengkap dan contoh praktis.',
          tags: ['vue', 'javascript', 'frontend', 'tutorial']
        }
      }
    })

    // File upload methods
    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        processFile(file)
      }
    }

    const handleDrop = (event) => {
      isDragOver.value = false
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        processFile(file)
      }
    }

    const processFile = (file) => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File terlalu besar. Maksimal 10MB.')
        return
      }

      uploadedFileName.value = file.name
      uploadedFileSize.value = file.size

      // Simulate upload progress
      uploadProgress.value = 0
      const interval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(interval)
          // In real app, upload to server and get URL
          form.value.thumbnail = URL.createObjectURL(file)
        }
      }, 100)
    }

    const removeImage = () => {
      form.value.thumbnail = ''
      uploadedFileName.value = ''
      uploadedFileSize.value = 0
      uploadProgress.value = 0
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Content formatting methods
    const formatText = (command) => {
      const textarea = document.getElementById('content')
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = form.value.content.substring(start, end)
      
      let formattedText = ''
      switch (command) {
        case 'bold':
          formattedText = `**${selectedText}**`
          break
        case 'italic':
          formattedText = `*${selectedText}*`
          break
      }
      
      form.value.content = form.value.content.substring(0, start) + formattedText + form.value.content.substring(end)
    }

    const insertImage = () => {
      const url = prompt('Masukkan URL gambar:')
      if (url) {
        const textarea = document.getElementById('content')
        const start = textarea.selectionStart
        const imageMarkdown = `![Alt text](${url})`
        form.value.content = form.value.content.substring(0, start) + imageMarkdown + form.value.content.substring(start)
      }
    }

    const insertLink = () => {
      const url = prompt('Masukkan URL:')
      const text = prompt('Masukkan teks link:')
      if (url && text) {
        const textarea = document.getElementById('content')
        const start = textarea.selectionStart
        const linkMarkdown = `[${text}](${url})`
        form.value.content = form.value.content.substring(0, start) + linkMarkdown + form.value.content.substring(start)
      }
    }

    const formatContent = (content) => {
      // Simple markdown to HTML conversion
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg">')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-800">$1</a>')
        .replace(/\n/g, '<br>')
    }

    // Tag management
    const addTag = () => {
      const tag = tagsInput.value.trim()
      if (tag && !form.value.tags.includes(tag)) {
        form.value.tags.push(tag)
        tagsInput.value = ''
      }
    }

    const removeTag = (index) => {
      form.value.tags.splice(index, 1)
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

    // Save content
    const saveContent = async () => {
      loading.value = true
      
      // Simulate API call
      setTimeout(() => {
        console.log('Saving content:', form.value)
        loading.value = false
        router.push('/content')
      }, 2000)
    }

    return {
      sidebarOpen,
      navigation,
      loading,
      showPreview,
      isDragOver,
      uploadProgress,
      uploadedFileName,
      uploadedFileSize,
      tagsInput,
      fileInput,
      isEdit,
      form,
      closeSidebarOnRouteChange,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      removeImage,
      formatFileSize,
      formatText,
      insertImage,
      insertLink,
      formatContent,
      addTag,
      removeTag,
      getNavigationLink,
      breadcrumbItems,
      saveContent
    }
  }
}
</script>
