<template>
  <div v-if="message" class="rounded-lg p-4 mb-4" :class="alertClasses">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg v-if="type === 'error'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <svg v-else-if="type === 'success'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else-if="type === 'warning'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium" :class="textClasses">
          {{ message }}
        </p>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="$emit('dismiss')"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="dismissButtonClasses"
          >
            <span class="sr-only">Dismiss</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'error',
      validator: (value) => ['error', 'success', 'warning', 'info'].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['dismiss'],
  setup(props) {
    const alertClasses = computed(() => {
      const baseClasses = 'rounded-lg p-4'
      const typeClasses = {
        error: 'bg-red-50 border border-red-200',
        success: 'bg-green-50 border border-green-200',
        warning: 'bg-yellow-50 border border-yellow-200',
        info: 'bg-blue-50 border border-blue-200'
      }
      return `${baseClasses} ${typeClasses[props.type]}`
    })

    const textClasses = computed(() => {
      const typeClasses = {
        error: 'text-red-800',
        success: 'text-green-800',
        warning: 'text-yellow-800',
        info: 'text-blue-800'
      }
      return typeClasses[props.type]
    })

    const dismissButtonClasses = computed(() => {
      const typeClasses = {
        error: 'text-red-500 hover:bg-red-100 focus:ring-red-600',
        success: 'text-green-500 hover:bg-green-100 focus:ring-green-600',
        warning: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
        info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
      }
      return typeClasses[props.type]
    })

    return {
      alertClasses,
      textClasses,
      dismissButtonClasses
    }
  }
}
</script>
