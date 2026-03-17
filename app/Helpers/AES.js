'use strict'

const CryptoJS = use('crypto-js')
const Crypto = use('crypto')
const fs = use("fs");
const { transform } = require('camaro');
const select = require('xml-crypto').xpath
const dom = require('@xmldom/xmldom').DOMParser
const SignedXml = require('xml-crypto').SignedXml
class AES {
    createSHA256(p_string) {
        const hash = Crypto.createHash('sha256')
        hash.update(p_string)
        return hash.digest('hex')
    }


    async xmlDigitalSignatureVerifier(file_path) {
        try {
            const xmlContent = fs.readFileSync(file_path, { encoding: 'utf8', flag: 'r' });
            var xml = fs.readFileSync(file_path).toString()

            var doc = new dom().parseFromString(xml)
            //console.log(doc)
            let cert = ''
            var signature = ''
            let templateTTChungPath = 'HDon/DLHDon/TTChung';

            let templateTTChung = [templateTTChungPath, {
                PBan: 'PBan',
                THDon: 'THDon',
                KHMSHDon: 'KHMSHDon',
                KHHDon: 'KHHDon',
                SHDon: 'SHDon',
                MHSo: 'MHSo',
                NLap: 'NLap',
                SBKe: 'SBKe',
                NBKe: 'NBKe',
                DVTTe: 'DVTTe',
                TGia: 'TGia',
                HTTToan: 'HTTToan',
                MSTTCGP: 'MSTTCGP',
                MSTDVNUNLHDon: 'MSTDVNUNLHDon',
                TDVNUNLHDon: 'TDVNUNLHDon',
                DCDVNUNLHDon: 'DCDVNUNLHDon'
            }];
            let jsonTTChung = await transform(xmlContent, templateTTChung);
            //console.log("jsonTTChung", jsonTTChung)
            if (jsonTTChung.length == 0) {
                const X509Certificate = [
                    "TDiep/DLieu/HDon/DSCKS/CQT/Signature/KeyInfo/X509Data",
                    {
                        X509Certificate: "X509Certificate"
                    },
                ];

                const X509CertificateNBan = [
                    "TDiep/DLieu/HDon/DSCKS/NBan/Signature/KeyInfo/X509Data",
                    {
                        X509Certificate: "X509Certificate"
                    },
                ];

                const Certificate = await transform(xmlContent, X509Certificate);
                const CertificateNBan = await transform(xmlContent, X509CertificateNBan);


                if (Certificate[0] == undefined) {
                    cert = CertificateNBan[0].X509Certificate
                    signature = select(doc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]
                } else {
                    cert = Certificate[0].X509Certificate
                    signature = select(doc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[1]
                }

            } else {
                const X509Certificate = [
                    "HDon/DSCKS/CQT/Signature/KeyInfo/X509Data",
                    {
                        X509Certificate: "X509Certificate"
                    },
                ];

                const X509CertificateNBan = [
                    "HDon/DSCKS/NBan/Signature/KeyInfo/X509Data",
                    {
                        X509Certificate: "X509Certificate"
                    },
                ];

                const Certificate = await transform(xmlContent, X509Certificate);
                const CertificateNBan = await transform(xmlContent, X509CertificateNBan);

                if (Certificate[0] == undefined) {
                    cert = CertificateNBan[0].X509Certificate
                    signature = select(doc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]
                } else {
                    cert = Certificate[0].X509Certificate
                    signature = select(doc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[1]
                }

            }




            let getPublicKeyFromCert = (p_certificate) => {
                try {
                    const max_size = 64;
                    const yardstick = new RegExp(`.{${max_size}}`, 'g'); // /.{10}/g;
                    const pieces = p_certificate.match(yardstick);
                    const accumulated = (pieces.length * max_size);
                    const modulo = p_certificate.length % accumulated;
                    if (modulo) pieces.push(p_certificate.slice(accumulated));
                    let certStr = ''
                    pieces.forEach(e => {
                        certStr += e += '\n'
                    });

                    let cert = `-----BEGIN CERTIFICATE-----\n${certStr}-----END CERTIFICATE-----`
                    return Crypto.createPublicKey(cert).export({ type: 'spki', format: 'pem' })
                } catch (error) {
                    console.log(error)
                }

            }



            var sig = new SignedXml()

            let keyInfoProv = (cert) => {
                return {
                    getKeyInfo: function () {
                        return `<X509Data><X509Certificate>${cert}</X509Certificate></X509Data>`
                    },
                    getKey: function (keyInfo) {
                        // return the public key in pem format
                        let pemPublicKey = getPublicKeyFromCert(cert)
                        return pemPublicKey

                    }
                }
            }

            sig.keyInfoProvider = keyInfoProv(cert) //this.KeyProvider(cert,p_publicKey)


            sig.loadSignature(signature)
            var res = sig.checkSignature(xml)

            if (!res) {
                console.log(sig.validationErrors)
                // return 'Error'
                console.log(res)
                return 'No'

            } else {
                console.log(res)
                return 'Yes'
            }
        } catch (error) {
            return error.message;
            console.log(error)
        }
    }
    getPublicKeyFromCert(p_certificate) {
        try {
            const max_size = 64;
            const yardstick = new RegExp(`.{${max_size}}`, 'g'); // /.{10}/g;
            const pieces = p_certificate.match(yardstick);
            const accumulated = (pieces.length * max_size);
            const modulo = p_certificate.length % accumulated;
            if (modulo) pieces.push(p_certificate.slice(accumulated));
            let certStr = ''
            pieces.forEach(e => {
                certStr += e += '\n'
            });

            let cert = `-----BEGIN CERTIFICATE-----\n${certStr}-----END CERTIFICATE-----`
            return Crypto.createPublicKey(cert).export({ type: 'spki', format: 'pem' })
        } catch (error) {
            console.log(error)
        }

    }
    generateKeyPair(p_modulusLength, p_algorithm) {
        const { publicKey, privateKey } = Crypto.generateKeyPairSync(p_algorithm, {
            modulusLength: p_modulusLength,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
                //format: 'der'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
                //format: 'der'
            }
        });
        //console.log('privateKey', privateKey)
        return { privateKey: privateKey.toString('base64'), publicKey: publicKey.toString('base64') };
    }
    sign(p_algorithm, p_data, p_privateKey) {
        const data = Buffer.from(p_data, "utf8");
        // Sign the data and returned signature in buffer
        //p_privateKey must be in the PEM format
        const signature = Crypto.sign(p_algorithm, data, p_privateKey);
        return signature.toString('base64');
    }
    verify(p_algorithm, p_data, p_publicKey, p_signature) {
        const signature = Buffer.from(p_signature, 'base64');
        const data = Buffer.from(p_data, 'utf8');
        const isVerified = Crypto.verify(p_algorithm, data, p_publicKey, signature);
        return isVerified;
    }
    encrypt(string, secret) {
        return CryptoJS.AES.encrypt(string, secret).toString()
    }

    decrypt(string, secret) {
        const bytes = CryptoJS.AES.decrypt(string, secret)
        return bytes.toString(CryptoJS.enc.Utf8)
    }

    decryptJava(string, secret) {
        //for java
        const iv = new Buffer.alloc(0)
        const key = secret
        const cipher = Crypto.createDecipheriv('aes-128-ecb', new Buffer.from(key), new Buffer.from(iv))
        cipher.setAutoPadding(false)
        let decrypted = cipher.update(string, 'base64', 'utf-8')
        decrypted += cipher.final('utf-8')
        return decrypted
    }
    decryptDotNet(encryptedText, key) {
        var alg = 'des-ede-cbc';
        var key = new Buffer.from(key, 'utf-8');
        var iv = new Buffer.from('QUJDREVGR0g=', 'base64'); //This is from c# cipher iv

        var encrypted = new Buffer.from(encryptedText, 'base64');
        var decipher = Crypto.createDecipheriv(alg, key, iv);
        var decoded = decipher.update(encrypted, 'binary', 'ascii');
        decoded += decipher.final('ascii');

        return decoded;
        /*
        public static string Encrypt(string source, string key)
    {
        TripleDESCryptoServiceProvider desCryptoProvider = new TripleDESCryptoServiceProvider();

        byte[] byteBuff;

        try
        {
            desCryptoProvider.Key = Encoding.UTF8.GetBytes(key);
            desCryptoProvider.IV = UTF8Encoding.UTF8.GetBytes("ABCDEFGH");
            byteBuff = Encoding.UTF8.GetBytes(source);

            string iv = Convert.ToBase64String(desCryptoProvider.IV);
            Console.WriteLine("iv: {0}", iv);

            string encoded =
                Convert.ToBase64String(desCryptoProvider.CreateEncryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));

            return encoded;
        }
        catch (Exception except)
        {
            Console.WriteLine(except + "\n\n" + except.StackTrace);
            return null;
        }
    }
        */
    }
    encryptDotNet(string, secret) {
        //for c#
        var alg = 'des-ede-cbc';
        var iv = new Buffer.from('QUJDREVGR0g=', 'base64'); //This is from c# cipher iv
        var key = new Buffer.from(secret, 'utf-8');
        const cipher = Crypto.createCipheriv(alg, key, iv)
        let crypted = cipher.update(string, 'utf-8', 'base64')
        crypted += cipher.final('base64')
        return crypted

        /*
        public static string DecryptDotNet(string cipherText, string secret = "didsvTHB6jUJHGUG")
        {
            // Set the algorithm and the IV
            //string alg = "des-ede-cbc"; // DESede stands for Triple DES (3DES)
            byte[] iv = Convert.FromBase64String("QUJDREVGR0g="); // IV used in the encryption

            // Convert the secret key to a byte array
            byte[] key = Encoding.UTF8.GetBytes(secret)
        ;

            // Convert the cipher text to a byte array
            byte[] cipherBytes = Convert.FromBase64String(cipherText);

            using (TripleDESCryptoServiceProvider tripleDes = new TripleDESCryptoServiceProvider())
            {
                // Set the mode and padding
                tripleDes.Mode = CipherMode.CBC;
                tripleDes.Padding = PaddingMode.PKCS7;

                using (ICryptoTransform decryptor = tripleDes.CreateDecryptor(key, iv))
                {
                    using (MemoryStream ms = new MemoryStream(cipherBytes))
                    {
                        using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader reader = new StreamReader(cs))
                            {
                                return reader.ReadToEnd();
                            }
                        }
                    }
                }
            }
        }
        */
    }
    encryptJava(p_plaintext, p_secret) {
        //https://stackoverflow.com/questions/60369148/how-do-i-replace-deprecated-crypto-createcipher-in-node-js        
        let iv = Buffer.from(p_secret, 'utf-8');
        let cipher = Crypto.createCipheriv('aes-128-cbc', Buffer.from(p_secret, 'utf-8'), iv);
        let encrypted = cipher.update(p_plaintext);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }
}

module.exports = AES