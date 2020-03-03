module.exports = {
	root: process.cwd(),	//用户当前执行的文件夹
	hostname: '127.0.0.1',
	port: 8888,
	compress: /\.(html|js|css|md)/,
	cache: {
		maxAge: 600,
		expires: true,
		cacheControl: true,
		lastModified: true,
		etag: true
	}
}