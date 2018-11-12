const findfile = require('findfile-in-folder-by-pathname')
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
        this.options = typeof opt === 'object' ? opt : {}
        this.serve = this.serve.bind(this)
    }

    serve(req, res, next){
        let self = this
        if(this.pathServe(req.url) && this.checkPrefix(req)){
            try{
                this.fileHandler(req,res, function(){
                    next()
                })
            }
            catch(e){
                console.error(e)
                next(e)
            }
        }
        else{
            res.statusCode = 404;
            req.content = `File not found!`
            next()
        }
    }

    checkPrefix(req){
        let check = true
        if( this.options.prefix && typeof this.options.prefix === 'string'){

            if(!req.params.pathname.startsWith(this.options.prefix)){
                check = false
            }
            else{
                req.params.pathname =  req.params.pathname.replace( this.options.prefix, '')
            }
        }
        return check
    }


    fileHandler(req, res, cb){
        let self = this
        
        let pathname = path.join(this.base, path.normalize(req.params.pathname).replace(/^(\.\.[\/\\])+/, ''));

        findfile.byPathname(this.base, pathname, { normalize : false }, function(err, resolvedpathname, data){
            if(data){
                res.setHeader('Content-type',self.getMimeType( path.parse(resolvedpathname).ext ) || 'text/plain' );
                req.content = data
                return;
            }
            else{
                res.statusCode = 404;
                req.content = 'File not found!';
                cb();
                return;
            }
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