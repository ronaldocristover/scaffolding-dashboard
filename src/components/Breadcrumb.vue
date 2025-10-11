<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <div v-if="index > 0" class="flex items-center">
          <svg class="h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="flex items-center">
          <router-link 
            v-if="item.to && index < breadcrumbs.length - 1"
            :to="item.to"
            class="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <component 
              v-if="item.icon" 
              :is="item.icon" 
              class="h-4 w-4 mr-1"
            />
            {{ item.name }}
          </router-link>
          <span 
            v-else
            class="text-sm font-medium"
            :class="index === breadcrumbs.length - 1 ? 'text-gray-900' : 'text-gray-500'"
          >
            <component 
              v-if="item.icon" 
              :is="item.icon" 
              class="h-4 w-4 mr-1"
            />
            {{ item.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    breadcrumbs() {
      return this.items.map(item => ({
        name: item.name,
        to: item.to || null,
        icon: item.icon || null
      }))
    }
  }
}
</script>
