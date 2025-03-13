// plugins/i18n.js
import { createI18n } from 'vue-i18n'

export async function installI18n(app) {
  const locale = localStorage.getItem('locale') || 'en-US'
  const messages = await loadLocale(locale)

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en-US',
    messages: { [locale]: messages }
  })

  app.use(i18n)
}

async function loadLocale(locale) {
  try {
    return await import(`../assets/locales/${locale}.json`)
  } catch {
    return import('../assets/locales/en-US.json')
  }
}
