'use strict'

const Helpers = use('Helpers')
const Utils = use('Utils')
const AES = use("AES")
const Env = use("Env")
const Request = use("Request")
const LOCAL_API_URL = Env.get('LOCAL_API_URL', Env.get('API_URL'))
const fs = require('fs')
const nodemailer = require('nodemailer')
const TOKEN_PATH = Env.get('TOKEN_PATH')
const CREDENTIAL_FILE = Env.get('CREDENTIAL_FILE')
const SEND_FROM_MAIL = Env.get('SEND_FROM_MAIL')

class SendMailController {
    async test({ request, response }) {
        try {
            const { proc, para } = request.all()
            console.log(para)
            let para2 = ''
            for (let i = 0; i < para.length; i++) {
                para2 += '?,'
            }
            if (para2.length > 1) {
                para2 = para2.substring(0, para2.length - 1)
            }
            const cnt = await Utils.ExecuteSQL(`Call ${proc} (${para2}) `, para)
                //console.log(cnt[0])
            return response.send(Utils.response(true, 'test', cnt[0][0]))
        } catch (e) {
            Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'test', CONTENT: e.message })
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async sendMail({ request, response, auth }) {
        try {
            let { mail_option, smtp_host, smtp_port, smtp_user, smtp_pass, tco_buspartner_pk, tco_busplace_pk, mail_type, template_pk, template_binding, _db2 } = request.all()
            let smtp_info = {
                host: Env.get(smtp_host),
                port: Env.get(smtp_port),
                secure: Env.get(smtp_port) == 465, // true for 465, false for other ports               
                tls: {
                    //secureProtocol: "TLSv1_method",
                    ciphers: 'SSLv3',
                    secure: false,
                    ignoreTLS: true,
                    rejectUnauthorized: false
                },
                auth: {
                    user: Env.get(smtp_user),
                    pass: Env.get(smtp_pass)
                }
            }
            const bearerToken = request.request.headers.authorization
            const attach_url1 = mail_option.attachments.length > 0 ? mail_option.attachments[0].path : ''
            const attach_url2 = mail_option.attachments.length > 1 ? mail_option.attachments[1].path : ''
            const attach_url3 = mail_option.attachments.length > 2 ? mail_option.attachments[2].path : ''
            const attach_url4 = mail_option.attachments.length > 3 ? mail_option.attachments[3].path : ''
            const attach_url5 = mail_option.attachments.length > 4 ? mail_option.attachments[4].path : ''

            const filename1 = mail_option.attachments.length > 0 ? mail_option.attachments[0].filename : ''
            const filename2 = mail_option.attachments.length > 1 ? mail_option.attachments[1].filename : ''
            const filename3 = mail_option.attachments.length > 2 ? mail_option.attachments[2].filename : ''
            const filename4 = mail_option.attachments.length > 3 ? mail_option.attachments[3].filename : ''
            const filename5 = mail_option.attachments.length > 4 ? mail_option.attachments[4].filename : ''

            // const filePath = Helpers.appRoot(mail_option.html)
            // const templateBodyHTML = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
            mail_option.from = Env.get(smtp_user)
            const res = await Request.post(LOCAL_API_URL + '/dso/apiproclob', { proc: 'sys_upd_sys_sendmail_log', para: ['i', '', tco_buspartner_pk, mail_option.subject, mail_option.html, Env.get(smtp_user), mail_option.to, attach_url1, attach_url2, attach_url3, attach_url4, attach_url5, filename1, filename2, filename3, filename4, filename5, 'Y', mail_type, template_pk, tco_busplace_pk], _db2 }, { headers: { Authorization: bearerToken } })

            if (res.data && res.data.data.length > 0) {
                const PK = res.data.data[0].PK
                template_binding.SYS_SENDMAIL_LOG_PK = PK
                mail_option.html = Utils.replaceString(mail_option.html, template_binding)
                const result = await Utils.smtpSendMail(mail_option, smtp_info)
                if (!result) {
                    await Request.post(LOCAL_API_URL + '/dso/apiproclob', { proc: 'sys_upd_sys_sendmail_log', para: ['u', PK, tco_buspartner_pk, '', '', mail_option.from, mail_option.to, attach_url1, attach_url2, attach_url3, attach_url4, attach_url5, filename1, filename2, filename3, filename4, filename5, 'N', mail_type, template_pk, tco_busplace_pk], _db2 }, { headers: { Authorization: bearerToken } })
                    return response.send(
                        Utils.response(false, 'sent_mail_failed', result)
                    )
                } else {
                    return response.send(
                        Utils.response(true, 'sent_mail_successful', result)
                    )
                }
            } else {
                return response.send(
                    Utils.response(true, 'sent_mail_failed', res)
                )
            }
        } catch (e) {
            Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'sendMail', CONTENT: e.message })
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async wrapedSendMail(mailOptions, p_token_path, p_credential_file) {
        return new Promise((resolve, reject) => {
            const credentials = JSON.parse(fs.readFileSync(p_credential_file))
            const tokens = JSON.parse(fs.readFileSync(p_token_path))
            const auth = {
                    type: 'OAuth2',
                    user: mailOptions.from,
                    clientId: credentials.installed.client_id.toString(),
                    clientSecret: credentials.installed.client_secret.toString(),
                    refreshToken: tokens.refresh_token.toString(),
                    accessToken: tokens.access_token.toString(),
                    expires: tokens.expiry_date,
                }
                //console.log(auth)	
                //console.log(mailOptions)
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: auth
            })

            transporter.sendMail(mailOptions, async function(error, info) {
                if (error) {
                    console.log("error send mail:")
                    console.log(error)
                    Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'wrapedSendMail', CONTENT: JSON.stringify(error) })
                    resolve(false) // or use rejcet(false) but then you will have to handle errors
                } else {
                    console.log('Email sent: ' + mailOptions.to)
                    resolve(true)
                }
            })
        })
    }

    async sendGMail({ request, response }) {
        try {
            let { mail_option, tco_buspartner_pk, tco_busplace_pk, mail_type, template_pk, template_binding, _db2 } = request.all()
          
            const bearerToken = request.request.headers.authorization
            const attach_url1 = mail_option.attachments.length > 0 ? mail_option.attachments[0].path : ''
            const attach_url2 = mail_option.attachments.length > 1 ? mail_option.attachments[1].path : ''
            const attach_url3 = mail_option.attachments.length > 2 ? mail_option.attachments[2].path : ''
            const attach_url4 = mail_option.attachments.length > 3 ? mail_option.attachments[3].path : ''
            const attach_url5 = mail_option.attachments.length > 4 ? mail_option.attachments[4].path : ''

            const filename1 = mail_option.attachments.length > 0 ? mail_option.attachments[0].filename : ''
            const filename2 = mail_option.attachments.length > 1 ? mail_option.attachments[1].filename : ''
            const filename3 = mail_option.attachments.length > 2 ? mail_option.attachments[2].filename : ''
            const filename4 = mail_option.attachments.length > 3 ? mail_option.attachments[3].filename : ''
            const filename5 = mail_option.attachments.length > 4 ? mail_option.attachments[4].filename : ''

            // const filePath = Helpers.appRoot(mail_option.html)
            // const templateBodyHTML = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
            mail_option.from = SEND_FROM_MAIL
            const res = await Request.post(LOCAL_API_URL + '/dso/apiproclob', { proc: 'sys_upd_sys_sendmail_log', para: ['i', '', tco_buspartner_pk, mail_option.subject, mail_option.html, mail_option.from, mail_option.to, attach_url1, attach_url2, attach_url3, attach_url4, attach_url5, filename1, filename2, filename3, filename4, filename5, 'Y', mail_type, template_pk, tco_busplace_pk], _db2 }, { headers: { Authorization: bearerToken } })
            if (res.data && res.data.data.length > 0) {
                const PK = res.data.data[0].PK
                template_binding.SYS_SENDMAIL_LOG_PK = PK
                mail_option.html = Utils.replaceString(mail_option.html, template_binding)
                const result = await this.wrapedSendMail(mail_option, TOKEN_PATH, CREDENTIAL_FILE)
                if (!result) {
                    await Request.post(LOCAL_API_URL + '/dso/apiproclob', { proc: 'sys_upd_sys_sendmail_log', para: ['u', PK, tco_buspartner_pk, '', '', mail_option.from, mail_option.to, attach_url1, attach_url2, attach_url3, attach_url4, attach_url5, filename1, filename2, filename3, filename4, filename5, 'N', mail_type, template_pk, tco_busplace_pk], _db2 }, { headers: { Authorization: bearerToken } })
                    return response.send(
                        Utils.response(false, 'sent_mail_failed', result)
                    )
                } else {
                    return response.send(
                        Utils.response(true, 'sent_mail_successful', result)
                    )
                }
            } else {
                return response.send(
                    Utils.response(true, 'sent_mail_failed', res)
                )
            }
        } catch (e) {
            Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'sendGMail', CONTENT: e.message })
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = SendMailController