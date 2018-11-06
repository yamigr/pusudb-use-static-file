const fs = require('fs')
const path = require('path')

class FileHandler {

    /**
     *
     * @param {string} base base path to the files
     * @param {array} escape which url should be escaped example the /db/put
     * @param {object} opt options to handle  { multipath : false }
     */
    constructor(base, escape, opt){
        this.base = base ? base : './'
        this.escape = Array.isArray(escape) ? escape : []
        this.options = Object.keys(opt).length ? opt : {}
        this.serve = this.serve.bind(this)
    }

    serve(req, res, next){
        let self = this
        if(req.method === 'GET' && this.pathServe(req.url)){
             try{
                this.fileHandler(req,res, function(){
                    next()
                })
             }
             catch(e){
                next(e)
             }
        }
        else{
            next()
        }
    }

    fileHandler(req, res, cb){
        let self = this
        let pathname = path.join(this.base, path.normalize(req.params.pathname).replace(/^(\.\.[\/\\])+/, ''));
        fs.exists(pathname, function (exist) {

            // when not exist send 404 or when multipath option is true go to next middleware
            if(!exist) {
                if(self.options.multipath){
                    cb()
                    return;
                }
                else{
                    res.statusCode = 404;
                    res.end(`File ${pathname} not found!`);
                    return;
                }
            }
            // is url / for index.html
            if (fs.statSync(pathname).isDirectory()) {
                pathname += '/index.html';
            }

            fs.readFile(pathname, function(err, data){

                if(err){
                    if(self.options.multipath){
                        cb()
                        return;
                    }
                    else{
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${err}.`);
                        return;
                    }
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