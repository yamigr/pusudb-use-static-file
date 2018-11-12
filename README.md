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

Create a static-instance and define the path where the static-files are located. Define some url's which should be escaped to put the request to the pusudb. When the static-files are located in different folders, put option multipath to true. Please notice, that the filename should be unique, even when the folder is different.

```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost')

var Static = require('pusudb-use-static-file')
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

