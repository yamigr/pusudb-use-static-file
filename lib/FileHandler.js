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

    /**
     * Check if the middleware should serve a file or go to next
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    serve(req, res, next){
        let self = this
        if(this.pathServe(req.url) && req.params.api.path){
            if(!this.checkPrefix(req)){
            res.statusCode = 404
            next()
            }
            else{
                try{
                this.fileHandler(req,res, function(){
                    next()
                })
                }
                catch(e){
                throw new Error(e)
                }
            }
        }
        else{
            next()
        }
    }

    /**
     * Normalize the path and get the file by pathname
     * @param {object} req 
     * @param {object} res 
     * @param {function} cb 
     */
    fileHandler(req, res, cb){
        let self = this
        
        let pathname = path.join(this.base, path.normalize(req.params.api.path).replace(/^(\.\.[\/\\])+/, ''))
        let ext = path.parse(pathname).ext
        //when no filetype is given
        if(req.params.api.path !== '/' && !ext)
            pathname += '.html'
            
        findfile.byPathname(this.base, pathname, { normalize : false , index : 'index.html' }, function(err, resolvedpathname, data){
         
            if(data){
                res.statusCode = 200
                res.setHeader('Content-type',self.getMimeType( path.parse(resolvedpathname).ext ) || 'text/plain' )
                res.write(data)
                res.end()
                cb(res.statusCode)
            }
            else{
                cb()
            }
        })
    }

    /**
     * Check the pathname if the prefix exists in pathname and parse it by the prefix. 
     * @param {object} req 
     */
    checkPrefix(req){
        let check = true
        if( this.options.prefix && typeof this.options.prefix === 'string'){
            if(!req.params.api.path.startsWith(this.options.prefix))
                check = false
            else
                req.params.api.path =  req.params.api.path.replace( this.options.prefix + '/', '/')
            
            if(!req.params.api.path)
                req.params.api.path = '/'
        }
        return check
    }

    /**
     * Check if the pathname should be handlet or escaped
     * @param {object} url 
     */
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