const http = require('http')
const conf = require('./config/defaultConfig')
const chalk = require('chalk')
const path = require('path')
const route = require('./helper/route')
const openUrl = require('./helper/openURL')

class Server {
	constructor(config) {
		this.conf = Object.assign({}, conf, config)
	}

	start() {
		const server = http.createServer((req, res) => {
			const filePath = path.join(this.conf.root, req.url)	//获取文件路径
			route(req, res, filePath, this.conf)
		})
		
		server.listen(this.conf.port, this.conf.hostname, () => {
			const address = `http://${this.conf.hostname}:${this.conf.port}`
			console.log(`Server started at ${chalk.green(address)}`)
			openUrl(address)
		})
	}
}

module.exports = Server