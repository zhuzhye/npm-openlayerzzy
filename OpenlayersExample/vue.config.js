

const port = 9999
const path = require('path')
const querystring = require('querystring')
module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  devServer: {
    port,
    proxy: {
      '/api': {
        target: "http://localhost:9999/",
        bypass: function (req, res) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          } else {
            const namepath = req.path.split("/")
            const name = namepath[namepath.length - 1]
            const tail = req.path.split(".")
            const tailname = tail[tail.length-1]
            if (tailname == "json") {
              return
            }
            if (name) {
              const mock = require(`./src/mock/${name}`)
              var data = ""
              if (req.method == 'POST') {
                req.on('data', (chunk) => {
                  data += chunk;
                });
                req.on('end', () => {
                  var dataObject = querystring.parse(data);
                  mock(req.method, dataObject, res)
                  delete require.cache[require.resolve(`./src/mock/${name}`)]
                });
              } else {
                mock(req.method, req.query, res)
                delete require.cache[require.resolve(`./src/mock/${name}`)]
              }
            }

          }
        }
      }
    }
  },
  configureWebpack(config) {
    config.resolve.alias["@"] = path.join(__dirname, 'src/')
    if (process.env.NODE_ENV === 'development') {
      config.name = 'vue最佳实践'
    } else {
      config.name = 'vue best practive'
    }

  },

}


