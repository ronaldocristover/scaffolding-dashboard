import appConfig from '../config/app.json'
import envConfig from '../config/environment.json'
import navConfig from '../config/navigation.json'
import messagesConfig from '../config/messages.json'

class ConfigService {
    constructor() {
        this.config = {
            app: appConfig,
            environment: envConfig,
            navigation: navConfig,
            messages: messagesConfig
        }

        // Get current environment
        this.currentEnv = import.meta.env.MODE || 'development'

        // Merge environment-specific config
        this.mergeEnvironmentConfig()
    }

    /**
     * Merge environment-specific configuration
     */
    mergeEnvironmentConfig() {
        const envSpecific = this.config.environment[this.currentEnv]
        if (envSpecific) {
            // Merge API config
            if (envSpecific.api) {
                this.config.app.api = { ...this.config.app.api, ...envSpecific.api }
            }

            // Add environment-specific properties
            this.config.app.environment = {
                ...envSpecific,
                name: this.currentEnv
            }
        }
    }

    /**
     * Get configuration value by path
     * @param {string} path - Dot notation path (e.g., 'app.name', 'theme.primary.500')
     * @param {*} defaultValue - Default value if path not found
     * @returns {*} Configuration value
     */
    get(path, defaultValue = null) {
        const keys = path.split('.')
        let value = this.config

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key]
            } else {
                return defaultValue
            }
        }

        return value
    }

    /**
     * Get app configuration
     */
    getApp() {
        return this.config.app
    }

    /**
     * Get theme configuration
     */
    getTheme() {
        return this.config.app.theme
    }

    /**
     * Get color by name and shade
     * @param {string} colorName - Color name (primary, secondary, etc.)
     * @param {string|number} shade - Color shade (500, 600, etc.)
     * @returns {string} Color value
     */
    getColor(colorName, shade = 500) {
        const color = this.get(`app.theme.${colorName}.${shade}`)
        return color || `#${shade}`
    }

    /**
     * Get branding configuration
     */
    getBranding() {
        return this.config.app.branding
    }

    /**
     * Get logo configuration
     */
    getLogo() {
        return this.config.app.branding.logo
    }

    /**
     * Get navigation configuration
     */
    getNavigation() {
        return this.config.navigation
    }

    /**
     * Get main navigation items
     */
    getMainNavigation() {
        return this.config.navigation.main || []
    }

    /**
     * Get footer navigation items
     */
    getFooterNavigation() {
        return this.config.navigation.footer || []
    }

    /**
     * Get user menu items
     */
    getUserMenu() {
        return this.config.navigation.userMenu || []
    }

    /**
     * Get messages configuration
     */
    getMessages() {
        return this.config.messages
    }

    /**
     * Get message by path
     * @param {string} path - Message path (e.g., 'auth.login.title')
     * @param {object} variables - Variables to replace in message
     * @returns {string} Message text
     */
    getMessage(path, variables = {}) {
        let message = this.get(`messages.${path}`, path)

        // Replace variables in message
        if (typeof message === 'string' && Object.keys(variables).length > 0) {
            Object.keys(variables).forEach(key => {
                message = message.replace(new RegExp(`{${key}}`, 'g'), variables[key])
            })
        }

        return message
    }

    /**
     * Get API configuration
     */
    getApi() {
        return this.config.app.api
    }

    /**
     * Get API base URL
     */
    getApiBaseUrl() {
        return this.get('app.api.baseURL', 'http://localhost:3001/api')
    }

    /**
     * Get feature flags
     */
    getFeatures() {
        return this.config.app.features
    }

    /**
     * Check if feature is enabled
     * @param {string} featureName - Feature name
     * @returns {boolean} Feature enabled status
     */
    isFeatureEnabled(featureName) {
        return this.get(`app.features.${featureName}`, false)
    }

    /**
     * Get layout configuration
     */
    getLayout() {
        return this.config.app.layout
    }

    /**
     * Get fonts configuration
     */
    getFonts() {
        return this.config.app.fonts
    }

    /**
     * Get validation rules
     */
    getValidation() {
        return this.config.app.validation
    }

    /**
     * Get upload configuration
     */
    getUpload() {
        return this.config.app.upload
    }

    /**
     * Get pagination configuration
     */
    getPagination() {
        return this.config.app.pagination
    }

    /**
     * Get social media links
     */
    getSocial() {
        return this.config.app.social
    }

    /**
     * Get contact information
     */
    getContact() {
        return this.config.app.contact
    }

    /**
     * Get current environment
     */
    getEnvironment() {
        return this.currentEnv
    }

    /**
     * Check if current environment is development
     */
    isDevelopment() {
        return this.currentEnv === 'development'
    }

    /**
     * Check if current environment is production
     */
    isProduction() {
        return this.currentEnv === 'production'
    }

    /**
     * Check if current environment is staging
     */
    isStaging() {
        return this.currentEnv === 'staging'
    }

    /**
     * Get debug mode status
     */
    isDebugMode() {
        return this.get('app.environment.debug', false)
    }

    /**
     * Get log level
     */
    getLogLevel() {
        return this.get('app.environment.logLevel', 'info')
    }

    /**
     * Check if mock data is enabled
     */
    isMockDataEnabled() {
        return this.get('app.environment.mockData', false)
    }

    /**
     * Update configuration at runtime
     * @param {string} path - Configuration path
     * @param {*} value - New value
     */
    set(path, value) {
        const keys = path.split('.')
        let current = this.config

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            if (!(key in current)) {
                current[key] = {}
            }
            current = current[key]
        }

        current[keys[keys.length - 1]] = value
    }

    /**
     * Get all configuration
     */
    getAll() {
        return this.config
    }

    /**
     * Reset configuration to default
     */
    reset() {
        this.config = {
            app: appConfig,
            environment: envConfig,
            navigation: navConfig,
            messages: messagesConfig
        }
        this.mergeEnvironmentConfig()
    }
}

// Create singleton instance
const configService = new ConfigService()

export default configService

// Export individual configs for direct access
export { appConfig, envConfig, navConfig, messagesConfig }
