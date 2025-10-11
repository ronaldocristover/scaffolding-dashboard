<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Table Header -->
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
      <slot name="header">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
          </div>
          <slot name="actions"></slot>
        </div>
      </slot>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center">
        <svg class="animate-spin h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">Memuat data...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 text-center">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Gagal Memuat Data</h3>
      <p class="text-gray-500 mb-4">{{ error }}</p>
      <Button
        text="Coba Lagi"
        variant="primary"
        size="sm"
        @click="$emit('retry')"
      />
    </div>

    <!-- Table Content -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:bg-gray-100' : '',
                column.align === 'center' ? 'text-center' : '',
                column.align === 'right' ? 'text-right' : ''
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center">
                <span>{{ column.label }}</span>
                <svg
                  v-if="column.sortable"
                  class="ml-1 h-4 w-4"
                  :class="getSortIconClass(column.key)"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
            </th>
            <th v-if="$slots.actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="data.length === 0" class="bg-white">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center">
                <svg class="h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-1">Tidak ada data</h3>
                <p class="text-gray-500">Belum ada data yang tersedia</p>
              </div>
            </td>
          </tr>
          <tr
            v-for="(row, index) in data"
            :key="getRowKey(row, index)"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 whitespace-nowrap text-sm',
                column.align === 'center' ? 'text-center' : '',
                column.align === 'right' ? 'text-right' : '',
                column.class || ''
              ]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getNestedValue(row, column.key)"
                :index="index"
              >
                <span v-if="column.type === 'date'">
                  {{ formatDate(getNestedValue(row, column.key)) }}
                </span>
                <span v-else-if="column.type === 'currency'">
                  {{ formatCurrency(getNestedValue(row, column.key)) }}
                </span>
                <span v-else-if="column.type === 'badge'">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getBadgeClass(getNestedValue(row, column.key), column.badgeOptions)"
                  >
                    {{ getNestedValue(row, column.key) }}
                  </span>
                </span>
                <span v-else>
                  {{ getNestedValue(row, column.key) }}
                </span>
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :row="row" :index="index">
                <!-- Default actions slot -->
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && data.length > 0" class="px-6 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-700">
          <span>
            Menampilkan {{ pagination.from }} sampai {{ pagination.to }} dari {{ pagination.total }} data
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Previous Button -->
          <Button
            text="Sebelumnya"
            variant="secondary"
            size="sm"
            :disabled="!pagination.prevPage"
            @click="$emit('page-change', pagination.currentPage - 1)"
          />
          
          <!-- Page Numbers -->
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-colors duration-200',
                page === pagination.currentPage
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
              @click="$emit('page-change', page)"
            >
              {{ page }}
            </button>
          </div>
          
          <!-- Next Button -->
          <Button
            text="Selanjutnya"
            variant="secondary"
            size="sm"
            :disabled="!pagination.nextPage"
            @click="$emit('page-change', pagination.currentPage + 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import Button from './Button.vue'

export default {
  name: 'Table',
  components: {
    Button
  },
  props: {
    // Data
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    },
    
    // Table configuration
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    
    // State
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    
    // Pagination
    pagination: {
      type: Object,
      default: null
    },
    
    // Sorting
    sortBy: {
      type: String,
      default: ''
    },
    sortOrder: {
      type: String,
      default: 'asc',
      validator: (value) => ['asc', 'desc'].includes(value)
    },
    
    // Row key
    rowKey: {
      type: [String, Function],
      default: 'id'
    }
  },
  emits: ['page-change', 'sort-change', 'retry'],
  setup(props, { emit }) {
    // Get row key
    const getRowKey = (row, index) => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey(row, index)
      }
      return row[props.rowKey] || index
    }

    // Get nested value from object
    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((current, key) => current?.[key], obj)
    }

    // Handle sort
    const handleSort = (columnKey) => {
      let newOrder = 'asc'
      if (props.sortBy === columnKey && props.sortOrder === 'asc') {
        newOrder = 'desc'
      }
      emit('sort-change', { column: columnKey, order: newOrder })
    }

    // Get sort icon class
    const getSortIconClass = (columnKey) => {
      if (props.sortBy !== columnKey) {
        return 'text-gray-300'
      }
      return props.sortOrder === 'asc' ? 'text-primary-600' : 'text-primary-600'
    }

    // Visible pages for pagination
    const visiblePages = computed(() => {
      if (!props.pagination) return []
      
      const { currentPage, totalPages } = props.pagination
      const pages = []
      const maxVisible = 5
      
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    // Format date
    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    // Format currency
    const formatCurrency = (amount) => {
      if (!amount) return '-'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(amount)
    }

    // Get badge class
    const getBadgeClass = (value, options = {}) => {
      const defaultClasses = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        draft: 'bg-gray-100 text-gray-800',
        published: 'bg-blue-100 text-blue-800'
      }
      
      const classes = { ...defaultClasses, ...options }
      return classes[value?.toLowerCase()] || 'bg-gray-100 text-gray-800'
    }

    return {
      getRowKey,
      getNestedValue,
      handleSort,
      getSortIconClass,
      visiblePages,
      formatDate,
      formatCurrency,
      getBadgeClass
    }
  }
}
</script>
