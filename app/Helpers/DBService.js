"use strict"
const NodeCache = require("node-cache")
const myCache = new NodeCache()
myCache.options.useClones = false
class DBService {
    constructor() {
        this.Env = use('Env')
        this.DB_CONNECTION = this.Env.get("DB_CONNECTION")
        this.DB_CONNECTION2 = this.Env.get("DB_CONNECTION2", "")
        if (this.DB_CONNECTION == "mysql") {
            this.myDB = use('MySQLService')
        } else if (this.DB_CONNECTION == "oracle") {
            this.myDB = use('OracleService')
        } else if (this.DB_CONNECTION == "pg") {
            this.myDB = use('PostgresService')
        } else {
            console.log(`Not support this DB[${this.DB_CONNECTION}] yet`)
        }
        if (this.DB_CONNECTION2 == "mysql2") {
            this.myDB2 = use('MySQLService')
        }
    }
    setCache(p_key, p_value, p_expire_seconds) {
        myCache.set(p_key, p_value, p_expire_seconds)
    }
    getCache(p_key) {
        return myCache.get(p_key)
    }
    getAllCached() {
        let arrObj = []
        const mykeys = myCache.keys()
        for (let i = 0; i < mykeys.length; i++) {
            arrObj.push(myCache.get(mykeys[i]))
        }
        return arrObj
    }

    async clearCache() {
        return this.myDB.clearCache()
    }
    async callProcCursor(p_proc, p_para = null, p_language, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                //console.log("this.myDB2", this.myDB2)
                return this.myDB2.callProcCursor(p_proc, p_para, p_language, p_crt_by)
            }
            return this.myDB.callProcCursor2(p_proc, p_para, p_language, p_crt_by)
        }
        return this.myDB.callProcCursor(p_proc, p_para, p_language, p_crt_by)
    }
    async callProcMultiCursor(p_proc, p_para = null, p_language, p_crt_by, p_number_cursor, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.callProcMultiCursor(p_proc, p_para, p_language, p_crt_by, p_number_cursor)
            }
            return this.myDB.callProcMultiCursor2(p_proc, p_para, p_language, p_crt_by, p_number_cursor)
        }
        return this.myDB.callProcMultiCursor(p_proc, p_para, p_language, p_crt_by, p_number_cursor)
    }
    async callBulkProcCursor(p_proc, p_para = null, p_language, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.callBulkProcCursor(p_proc, p_para, p_language, p_crt_by);
            }
            return this.myDB.callBulkProcCursor2(p_proc, p_para, p_language, p_crt_by);
        }
        return this.myDB.callBulkProcCursor(p_proc, p_para, p_language, p_crt_by);
    }
    async callBulkProcClob(p_proc, p_para = null, p_language, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.callBulkProcCursor(p_proc, p_para, p_language, p_crt_by);
            }
            return this.myDB.callBulkProcClob2(p_proc, p_para, p_language, p_crt_by);
        }
        return this.myDB.callBulkProcClob(p_proc, p_para, p_language, p_crt_by);
    }
    async ExecuteSQLBlob(p_statement, p_bind = {}, p_language, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.ExecuteSQLBlob(p_statement, p_bind, p_language, p_crt_by)
            }
            return this.myDB.ExecuteSQLBlob2(p_statement, p_bind, p_language, p_crt_by)
        }
        return this.myDB.ExecuteSQLBlob(p_statement, p_bind, p_language, p_crt_by)
    }
    async ExecuteSQL(p_sql, p_para, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.ExecuteSQL(p_sql, p_para, p_crt_by)
            }
            return this.myDB.ExecuteSQL2(p_sql, p_para, p_crt_by)
        }
        return this.myDB.ExecuteSQL(p_sql, p_para, p_crt_by)
    }
}
module.exports = DBService