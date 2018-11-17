# pusudb-use-static-file

> Middleware to serve static-files with the pusudb-framework.

This middleware adds a file-handler to the pusudb-framework to sending static files to the client.

Framework: [https://www.npmjs.com/package/pusudb](https://www.npmjs.com/package/pusudb)

<a name="installing"></a>
## Installing

```sh
npm install pusudb-use-static-file --save
```

## Use

Define the path where the static-files are located. Define some url's which should be escaped. To define a url-prefix use the option prefix.

```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost')

var Static = require('pusudb-use-static-file')

// url with prefix '/css' : http://localhost:3000/css/main.css
var static = new Static(__dirname + '/node_modules/css', ['/db', /* blocked pathnames */], { prefix : '/css' }) 

//add the middleware to the pusudb
pusudb.use('http', static.serve)

pusudb.listen(function(port, host){
    console.log('pusudb listening:', port, host)
})
```
<a name="authors"></a>

## Authors

* **Yannick Grund** - *Initial work* - [yamigr](https://github.com/yamigr)

<a name="license"></a>

## License

This project is licensed under the MIT License

