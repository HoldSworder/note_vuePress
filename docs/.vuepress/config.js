/**
 * @Date         : 2020-10-14 15:53:33
 * @Description  : vueperss config
 * @Autor        : Qzr(z5021996@vip.qq.com)
 * @LastEditors  : Qzr(z5021996@vip.qq.com)
 * @LastEditTime : 2020-10-16 15:02:53
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
    // displayAllHeaders: true, //示所有页面的标题链接
    // sidebarDepth: 5,
    sidebar: getSliderbar(dirPath)
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
      const fildDir = isFileDir(childPath)  // 命中子文件没有文件夹情况 返回文件夹下唯一md文件
      if ((fildDir !== '') && fildDir) {
        isFileHandle(fildDir, res)
      }else {
        const children = getSliderbar(childPath)
        
        if (children.length !== 0) {
          res.push({
            title: item,
            sidebarDepth: 0,
            children,
          })
        }
      }
		}

		if (stats.isFile() && (childPath.slice(-2) === 'md')) {
      isFileHandle(childPath, res)
		}

    
  }

  return res
}

function isFileHandle(childPath, res) {
  const extName = childPath.slice(-2)
  let noteName = ''

  if(extName !== 'md') return
  
  if(!fs.existsSync(childPath)) return 

  let mdPath = childPath
      .slice(childPath.indexOf('docs') + 5).replace(/\\/g, '/')

  const fileName = mdPath.split('/').slice(-1)[0]

  if(fileName === 'README.md') {
    mdPath = mdPath.split('/').slice(0, -1).join('/') + '/'
  }
  
  const mdPathArr = mdPath.split('/')
  
  if(fileName === 'README.md' || fileName === 'readme.md') { 
    noteName = mdPathArr[mdPathArr.length - 2]
  }else {
    noteName = mdPathArr[mdPathArr.length - 1].slice(0, -3)
  }


  res.push({
    path: '/' + mdPath,
    title: noteName
  })

}

function isFileDir(dirPath) {
  if(!fs.existsSync(dirPath)) return 

  const dirData = fs.readdirSync(dirPath)
  let mdFile = ''
  
  for (const item of dirData) {
    const childPath = path.resolve(dirPath, item)
    const stats = fs.statSync(childPath)
    
    if(stats.isDirectory()) {
      return false
    }

    if(item.slice(-2) === 'md') {
      mdFile = childPath
    }
  }

	return mdFile
}
