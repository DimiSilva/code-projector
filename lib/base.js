"use strict"

const routesBody = (jwt, koaBody) =>
    `"use strict"
const Router = require('koa-router') ${koaBody ? "\nconst KoaBody = require('koa-body')" : ''}
const Bind = require('koa-clean') //this will make the controllers more clean ${jwt ? "\nconst Jwt = require('koa-jwt')\n\nconst Secret = use('config').jwtsecret\nconst jwtMiddleware = Jwt({ secret: Secret })" : ''}

module.exports =  [  ]`

const indexBody = () =>
    ` "use strict"

global.__basepath = __dirname + '/'
global.use = path => require(__basepath + path)

const Koa = require('koa')
const Bodyparser = require('koa-bodyparser')
const Logger = require('koa-logger')
const Cors = require('@koa/cors')
const Mongo = require('koa-mongo')

const config = use('config')
const routes = use('routes')

const app = new Koa()

app.use(Mongo({
    url: config.mongodb_uri,
    max: 100,
    min: 1
}))

app.use(Logger())
app.use(Cors({ origin: '*' }))
app.use(Bodyparser({ jsonLimit: '15mb' }))

routes.forEach(route => app.use(route.routes()))

app.listen(config.port, () => {
    console.log(\`🚀  api running on \${config.port} port \${config.port}\`)
})`

const configBody = () =>
    `const env = process.env.NODE_ENV || "dev"

const configs =
{
    dev:
    {
        jwtsecret: ''
         , mongodb_uri: ''
        , port: 3000
    }
    , staging:
    {
        jwtsecret: process.env.JWTSECRET
        , mongodb_uri: process.env.MONGODB_URI
        , port: process.env.PORT
    }
    , production:
    {
        jwtsecret: process.env.JWTSECRET
        , mongodb_uri: process.env.MONGODB_URI
        , port: process.env.PORT
    }
}

Object.entries(configs).forEach(([env, arr]) => arr.env = env)

const config = configs[env]
if (!config)
    throw new Error(\`NODE_ENV \\\`\${env}\\\` NOT CONFIGURED!\`)

const badProperty = Object.entries(config).find(([key, value]) => value === undefined)
if (badProperty)
    throw new Error(\`NODE_ENV \\\`\${env}\\\` KEY \\\`\${badProperty[0]}\\\` is undefined! Please configure it!\`)


module.exports = config`

module.exports = { routesBody, indexBody, configBody }