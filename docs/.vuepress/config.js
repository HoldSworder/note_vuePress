/**
 * @Date         : 2020-10-14 15:53:33
 * @Description  : vueperss config
 * @Autor        : Qzr(z5021996@vip.qq.com)
 * @LastEditors  : Qzr(z5021996@vip.qq.com)
 * @LastEditTime : 2020-10-15 11:07:57
 */

const path = require('path')
const fs = require('fs')

const dirPath = path.resolve(__filename, '../../note')

module.exports = {
	title: "Qzr's Note",
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Note', link: '/note/' },
			{ text: 'GitHub', link: 'https://github.com/HoldSworder' },
		],
		displayAllHeaders: true,
		sidebar: {
			'/note': getSliderbar(dirPath),
		},
		sidebarDepth: 3,
	},
}

function getSliderbar(filePath) {
  if(!fs.existsSync(filePath)) return 
  
	const res = []
	const dirData = fs.readdirSync(filePath)
	for (const item of dirData) {
    const childPath = path.resolve(filePath, item)
		const stats = fs.statSync(childPath)
    
		if (stats.isDirectory()) {
      if (isFileDir(childPath)) {
        isFileHandle(childPath, item, res)
			}else {
        const children = getSliderbar(childPath)
        
        if (children.length !== 0) {
          res.push({
            title: item,
            children,
          })
        }
      }

		}

		if (stats.isFile()) {
      isFileHandle(childPath, item, res)
		}

    
  }
  
  return res
}

function isFileHandle(childPath, item, res) {
  const mdPath = childPath
      .slice(childPath.indexOf('docs') + 5).replace(/\\/g, '/')
      .split('/').slice(0, -1).join('/') + '/'

  const extName = path
    .extname(item)
    .toLowerCase()
    .slice(1)

  if (extName.indexOf('md') !== -1) {
    console.log(mdPath)
    res.push({
      path: mdPath,
      title: mdPath.split('/')[mdPath.length - 2],
    })
  }
}

function isFileDir(dirPath) {
	const dirData = fs.readdirSync(dirPath)
	if ((dirData.length === 1) && (dirData[0].slice(-2) === 'md')) {
		return true
	}

	return false
}
