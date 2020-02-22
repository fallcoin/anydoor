const http = require('http')
const conf = require('./config/defaultConfig')
const chalk = require('chalk')

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello HTTP!')
})

server.listen(conf.port, conf.hostname, () => {
    const address = `http://${conf.hostname}:${conf.port}`
    console.log(`Server started at ${chalk.green(address)}`)
})