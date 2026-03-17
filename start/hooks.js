'use strict'

const { hooks } = require('@adonisjs/ignitor')

hooks.after.httpServer(() => {
  use('App/Services/Nuxt')
})

/**
 * Helpers
 */
hooks.after.providersBooted(() => {
  const View = use('View')
  const Env = use('Env')

  View.global('rootUrl', () => {
    return Env.get('APP_URL')
  })

  View.global('awcUrl', () => {
    return `${Env.get('APP_URL')}/awc`
  })
})
