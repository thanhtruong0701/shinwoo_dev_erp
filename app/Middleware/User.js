'use strict'
class User {
    async handle({ response, auth }, next) {
        try {
            const User = await auth.getUser();
            if (!User) {
                response.clearCookie('token');
                response.clearCookie('user');
                response.clearCookie("*");
                console.error("Failed get user info by token");
                return response.send(false);
            }
            await next();

        } catch (e) {
            const d = new Date();
            let dateText = d.toLocaleString();
            console.error(`[Invalid token: ${dateText}]:  ${e.message}`);
            if (e.message.indexOf("Timeout acquiring a connection") >= 0) {
                console.error("Restart process");
                process.exit() //exit process then pm2 auto start this process again
                //close connection pool
                // try{
                //     await oracledb.getPool().close(5)
                //     console.error("close pool ok [User Middleware]")                    
                // }catch(e2){                    
                //     console.error(e2)
                //     process.exit() //exit process then pm2 auto start this process again
                // }
                // await next()
               
            } else {
                response.clearCookie('token');
                response.clearCookie('user');
                response.clearCookie("*");
                //return response.redirect('/login');
                return response.send(e.message);
            }
        }
    }
}

module.exports = User;