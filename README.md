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

```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost')

var Static = require('pusudb-use-static-file')
var static = new Static(__dirname + '/public', ['/db']) 

// new Static(< path to the static files >, < array of url's to escape when a get-request fired >)
// http://localhost:3000/index.html the main-path is not necessary in the url
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

