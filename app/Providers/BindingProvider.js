const { ServiceProvider, ioc } = require('@adonisjs/fold')

const Utils = use('App/Helpers/Utils')
const Firebase = use('App/Helpers/Firebase')
const MySQLService = use('App/Helpers/MySQLService')
const OracleService = use('App/Helpers/OracleService')
const DBService = use('App/Helpers/DBService')
const AES = use('App/Helpers/AES')
const Request = use('App/Helpers/Request')
const CommcodeRepo = use('App/Models/Repositories/CommcodeRepo')
const UserRepo = use('App/Models/Repositories/UserRepo')
const SettingRepo = use('App/Models/Repositories/SettingRepo')
const LoginLogRepo = use('App/Models/Repositories/LoginLogRepo')
const PromotionRepo = use('App/Models/Repositories/PromotionRepo')
const PromotionUserRepo = use('App/Models/Repositories/PromotionUserRepo')


class BindingProvider extends ServiceProvider {
    register() {
        ioc.bind('Firebase', function(app) {
            return new Firebase
        })
        ioc.bind('DBService', function(app) {
            return new DBService
        })
        ioc.bind('MySQLService', function(app) {
            return new MySQLService
        })
        ioc.bind('OracleService', function(app) {
            return new OracleService
        })
        ioc.bind('PromotionUserRepo', function(app) {
            return new PromotionUserRepo
        })
        ioc.bind('PromotionRepo', function(app) {
            return new PromotionRepo
        })
        ioc.bind('LoginLogRepo', function(app) {
            return new LoginLogRepo
        })
        ioc.bind('Utils', function(app) {
            return new Utils
        })
        ioc.bind('AES', function(app) {
            return new AES
        })
        ioc.bind('ReportHelper', function(app) {
            return new ReportHelper
        })
        ioc.bind('ImportHelper', function(app) {
            return new ImportHelper
        })
        ioc.bind('Request', function(app) {
            return new Request
        })
        ioc.bind('CommcodeRepo', function(app) {
            return new CommcodeRepo
        })
        ioc.bind('UserRepo', function(app) {
            return new UserRepo
        })
        ioc.bind('SettingRepo', function(app) {
            return new SettingRepo
        })
    }

    boot() {
        // optionally do some intial setup
    }
}

module.exports = BindingProvider