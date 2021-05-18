/**
 * 显示菜单
 */
function showMenu () {
  const prompt = require('@system.prompt')
  const router = require('@system.router')
  const appInfo = require('@system.app').getInfo()
  
  console.log('appInfo', appInfo)

  prompt.showContextMenu({
    itemList: ['保存桌面', '关于', '取消'],
    success: function (ret) {
      switch (ret.index) {
      case 0:
        // 保存桌面
        createShortcut()
        break
      case 1:
        // 关于
        router.push({
          uri: '/About',
          params: {
            name: appInfo.name,
            icon: appInfo.icon
          }
        })
        break
      case 2:
        // 取消
        break
      default:
        prompt.showToast({
          message: 'error'
        })
      }
    }
  })
}

/**
 * 创建桌面图标
 * 注意：使用加载器测试`创建桌面快捷方式`功能时，请先在`系统设置`中打开`应用加载器`的`桌面快捷方式`权限
 */
function createShortcut (callback) {
  const prompt = require('@system.prompt')
  const shortcut = require('@system.shortcut')
  shortcut.hasInstalled({
    success: function (ret) {
      console.log('ret',ret)
      if (ret) {
        prompt.showToast({
          message: '已创建桌面图标'
        })
      } else {
        shortcut.install({
          message: '添加【若看小说】到手机桌面图标，下次点击图标继续看书，无需下载安装',
          success: function () {
            prompt.showToast({
              message: '成功创建桌面图标'
            })
            callback(true)
          },
          fail: function (errmsg, errcode) {
            // prompt.showToast({
            //   message: `${errcode}: ${errmsg}`
            // })
            prompt.showToast({
              message: '创建桌面图标失败'
            })
            callback(false)
          }
        })
      }
    }
  })
}

export default {
  showMenu,
  createShortcut
}
