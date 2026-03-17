'use strict'

const Antl = use('Antl')
const Utils = use('Utils')
const Env = use('Env');
const ex = Env.get('CACHE_EXPIRE')
const fs = require('fs')

class VideoController {
    async VideoStream({ request, response }) {
        try {
            const { video_file, token } = request.all()
            const path = `video/${video_file}`
            const stat = fs.statSync(path)
            const fileSize = stat.size
            const range = request.request.headers.range
            //console.log(response.response)
            if (range) {
                //console.log(range)
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize - 1
                    
                if (start >= fileSize) {
                    response.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                    return
                }

                const chunksize = (end - start) + 1
                const file = fs.createReadStream(path, { start, end })
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                }

                //response.writeHead(206, head)
                response.header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
                response.header('Accept-Ranges', 'bytes')
                response.header('Content-Length', chunksize)
                response.header('Content-Type', 'video/mp4')
                //console.log(response)
                response.status(206).send()
                //console.log(response.response)
                return file.pipe(response.response)
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                }
                console.log(fileSize)
                //response.writeHead(200, head)
                response.header('Content-Length', fileSize)
                response.header('Content-Type', 'video/mp4')
                response.status(200).send()
                return fs.createReadStream(path).pipe(response.response)
            }
        }
        catch (e) {
            Utils.Logger({ level: 'error', module: 'VideoController', func: 'VideoStream', content: e.message })
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = VideoController