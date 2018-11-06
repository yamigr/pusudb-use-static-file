const fs = require('fs')
const path = require('path')

class FileHandler {

    constructor(base, escape){
        this.base = base ? base : './'
        this.escape = Array.isArray(escape) ? escape : []
        this.serve = this.serve.bind(this)
    }

    serve(req, res, next){
        let self = this
        if(req.method === 'GET' && this.pathServe(req.url)){
             try{
                this.fileHandler(req,res)
             }
             catch(e){
                next(e)
             }
        }
        else{
            next()
        }
    }

    fileHandler(req, res){
        let self = this
        let pathname = path.join(__dirname, path.normalize(req.params.pathname).replace(/^(\.\.[\/\\])+/, ''));
        fs.exists(pathname, function (exist) {

            if(!exist) {
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }

            if (fs.statSync(pathname).isDirectory()) {
                pathname += '/index.html';
            }

            fs.readFile(pathname, function(err, data){
                if(err){
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } 
                else{
                    res.setHeader('Content-type',self.getMimeType( path.parse(pathname).ext ) || 'text/plain' );
                    res.end(data);
                }
            })

        })
    }

    pathServe(url){
        for(let p in this.escape){
            if(url.startsWith(this.escape[p])){
                return false
            }
        }
        return true
    }

    getMimeType(type){
        let mimeType =  {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.eot': 'appliaction/vnd.ms-fontobject',
            '.ttf': 'aplication/font-sfnt'
        }

        return mimeType[ type ] || 'text/plain'

    }
}

module.exports = FileHandler