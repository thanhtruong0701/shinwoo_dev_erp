'use strict'

const BaseRepo = use('App/Models/Repositories/BaseRepo')

class UserRepo extends BaseRepo {
  constructor() {
    const User = use('App/Models/User')
    super(User)
  }
}

module.exports = UserRepo