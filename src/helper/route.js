const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const Handlebars = require('handlebars')
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range')
const isFresh = require('../helper/cache')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString())

module.exports = async function (req, res, filePath, config) {
	try {
		const stats = await stat(filePath)
		if (stats.isFile()) {
			//访问资源为文件
			const contentType = mime(filePath)
			res.setHeader('Content-Type', contentType)

			if (isFresh(stats, req, res)) {
				//判断数据是否过期
				res.statusCode = 304
				res.end()
				return
			}

			let rs
			const { code, start, end } = range(stats.size, req, res)
			if (code === 200) {
				//全部传输
				res.statusCode = 200
				rs = fs.createReadStream(filePath)
			} else {
				//范围请求传输
				res.statusCode = 206
				rs = fs.createReadStream(filePath, { start, end })
			}

			if (filePath.match(config.compress)) {
				rs = compress(rs, req, res)
			}

			rs.pipe(res)
		} else if (stats.isDirectory()) {
			//访问资源为文件夹
			const files = await readdir(filePath)	//当前文件夹下所有文件
			res.statusCode = 200
			res.setHeader('Content-Type', 'text/html')
			const dir = path.relative(config.root, filePath)	//文件夹的绝对路径
			const data = {
				title: path.basename(filePath),
				dir: dir ? `/${dir}` : '',
				files: files.map(file => {
					return {
						file,	//文件名
						icon: mime(file)	//图标
					}
				})
			}
			res.end(template(data))		
		}
	} catch (ex) {
		res.statusCode = 404
		res.setHeader('Content-Type', 'text/plain')
		res.end(`${filePath} is not a directory or file\n ${ex.toString()}`)
	}
}