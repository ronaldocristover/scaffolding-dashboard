import { ref, computed, readonly } from 'vue'
import configService from '../services/config'

/**
 * Composable for accessing application configuration
 * @returns {object} Configuration utilities
 */
export function useConfig() {
    // Reactive config state
    const config = ref(configService.getAll())

    /**
     * Get configuration value by path
     * @param {string} path - Dot notation path
     * @param {*} defaultValue - Default value
     * @returns {*} Configuration value
     */
    const get = (path, defaultValue = null) => {
        return configService.get(path, defaultValue)
    }

    /**
     * Get app configuration
     */
    const app = computed(() => config.value.app)

    /**
     * Get theme configuration
     */
    const theme = computed(() => config.value.app.theme)

    /**
     * Get branding configuration
     */
    const branding = computed(() => config.value.app.branding)

    /**
     * Get logo configuration
     */
    const logo = computed(() => config.value.app.branding.logo)

    /**
     * Get navigation configuration
     */
    const navigation = computed(() => config.value.navigation)

    /**
     * Get main navigation items
     */
    const mainNavigation = computed(() => config.value.navigation.main || [])

    /**
     * Get footer navigation items
     */
    const footerNavigation = computed(() => config.value.navigation.footer || [])

    /**
     * Get user menu items
     */
    const userMenu = computed(() => config.value.navigation.userMenu || [])

    /**
     * Get messages configuration
     */
    const messages = computed(() => config.value.messages)

    /**
     * Get API configuration
     */
    const api = computed(() => config.value.app.api)

    /**
     * Get features configuration
     */
    const features = computed(() => config.value.app.features)

    /**
     * Get layout configuration
     */
    const layout = computed(() => config.value.app.layout)

    /**
     * Get fonts configuration
     */
    const fonts = computed(() => config.value.app.fonts)

    /**
     * Get validation configuration
     */
    const validation = computed(() => config.value.app.validation)

    /**
     * Get upload configuration
     */
    const upload = computed(() => config.value.app.upload)

    /**
     * Get pagination configuration
     */
    const pagination = computed(() => config.value.app.pagination)

    /**
     * Get social media links
     */
    const social = computed(() => config.value.app.social)

    /**
     * Get contact information
     */
    const contact = computed(() => config.value.app.contact)

    /**
     * Get current environment
     */
    const environment = computed(() => configService.getEnvironment())

    /**
     * Check if feature is enabled
     * @param {string} featureName - Feature name
     * @returns {boolean} Feature enabled status
     */
    const isFeatureEnabled = (featureName) => {
        return configService.isFeatureEnabled(featureName)
    }

    /**
     * Get color by name and shade
     * @param {string} colorName - Color name
     * @param {string|number} shade - Color shade
     * @returns {string} Color value
     */
    const getColor = (colorName, shade = 500) => {
        return configService.getColor(colorName, shade)
    }

    /**
     * Get message by path
     * @param {string} path - Message path
     * @param {object} variables - Variables to replace
     * @returns {string} Message text
     */
    const getMessage = (path, variables = {}) => {
        return configService.getMessage(path, variables)
    }

    /**
     * Check if current environment is development
     */
    const isDevelopment = computed(() => configService.isDevelopment())

    /**
     * Check if current environment is production
     */
    const isProduction = computed(() => configService.isProduction())

    /**
     * Check if current environment is staging
     */
    const isStaging = computed(() => configService.isStaging())

    /**
     * Check if debug mode is enabled
     */
    const isDebugMode = computed(() => configService.isDebugMode())

    /**
     * Get log level
     */
    const logLevel = computed(() => configService.getLogLevel())

    /**
     * Check if mock data is enabled
     */
    const isMockDataEnabled = computed(() => configService.isMockDataEnabled())

    /**
     * Update configuration at runtime
     * @param {string} path - Configuration path
     * @param {*} value - New value
     */
    const set = (path, value) => {
        configService.set(path, value)
        config.value = configService.getAll()
    }

    /**
     * Reset configuration to default
     */
    const reset = () => {
        configService.reset()
        config.value = configService.getAll()
    }

    return {
        // Configuration data
        config: readonly(config),
        app,
        theme,
        branding,
        logo,
        navigation,
        mainNavigation,
        footerNavigation,
        userMenu,
        messages,
        api,
        features,
        layout,
        fonts,
        validation,
        upload,
        pagination,
        social,
        contact,
        environment,

        // Utility functions
        get,
        getColor,
        getMessage,
        isFeatureEnabled,
        set,
        reset,

        // Environment checks
        isDevelopment,
        isProduction,
        isStaging,
        isDebugMode,
        logLevel,
        isMockDataEnabled
    }
}

/**
 * Composable for accessing theme configuration
 * @returns {object} Theme utilities
 */
export function useTheme() {
    const { theme, getColor } = useConfig()

    /**
     * Get primary color
     */
    const primary = computed(() => theme.value.primary)

    /**
     * Get secondary color
     */
    const secondary = computed(() => theme.value.secondary)

    /**
     * Get accent color
     */
    const accent = computed(() => theme.value.accent)

    /**
     * Get danger color
     */
    const danger = computed(() => theme.value.danger)

    /**
     * Get warning color
     */
    const warning = computed(() => theme.value.warning)

    /**
     * Get success color
     */
    const success = computed(() => theme.value.success)

    /**
     * Get CSS custom properties for theme
     */
    const cssVariables = computed(() => {
        const vars = {}

        Object.keys(theme.value).forEach(colorName => {
            Object.keys(theme.value[colorName]).forEach(shade => {
                vars[`--color-${colorName}-${shade}`] = theme.value[colorName][shade]
            })
        })

        return vars
    })

    return {
        theme,
        primary,
        secondary,
        accent,
        danger,
        warning,
        success,
        getColor,
        cssVariables
    }
}

/**
 * Composable for accessing messages
 * @returns {object} Message utilities
 */
export function useMessages() {
    const { messages, getMessage } = useConfig()

    /**
     * Get common messages
     */
    const common = computed(() => messages.value.common || {})

    /**
     * Get authentication messages
     */
    const auth = computed(() => messages.value.auth || {})

    /**
     * Get dashboard messages
     */
    const dashboard = computed(() => messages.value.dashboard || {})

    /**
     * Get content messages
     */
    const content = computed(() => messages.value.content || {})

    /**
     * Get profile messages
     */
    const profile = computed(() => messages.value.profile || {})

    /**
     * Get error messages
     */
    const errors = computed(() => messages.value.errors || {})

    /**
     * Get validation messages
     */
    const validation = computed(() => messages.value.validation || {})

    /**
     * Get notification messages
     */
    const notifications = computed(() => messages.value.notifications || {})

    return {
        messages,
        common,
        auth,
        dashboard,
        content,
        profile,
        errors,
        validation,
        notifications,
        getMessage
    }
}

/**
 * Composable for accessing navigation
 * @returns {object} Navigation utilities
 */
export function useNavigation() {
    const { navigation, mainNavigation, footerNavigation, userMenu } = useConfig()

    /**
     * Get navigation items by permission
     * @param {string} userRole - User role
     * @returns {array} Filtered navigation items
     */
    const getNavigationByRole = (userRole) => {
        return mainNavigation.value.filter(item => {
            if (!item.permissions) return true
            return item.permissions.includes(userRole)
        })
    }

    /**
     * Get visible navigation items
     * @returns {array} Visible navigation items
     */
    const getVisibleNavigation = () => {
        return mainNavigation.value.filter(item => item.visible !== false)
    }

    /**
     * Get navigation item by path
     * @param {string} path - Navigation path
     * @returns {object|null} Navigation item
     */
    const getNavigationByPath = (path) => {
        return mainNavigation.value.find(item => item.path === path)
    }

    return {
        navigation,
        mainNavigation,
        footerNavigation,
        userMenu,
        getNavigationByRole,
        getVisibleNavigation,
        getNavigationByPath
    }
}
