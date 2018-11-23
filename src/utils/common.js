/* eslint-disable */
export function getShareParamter (key) {
  var arr = window.location.href.split('?')
  var param = ''
  if (arr.length > 2) {
    param = arr[2]
  } else if (arr.length > 1) {
    param = arr[1]
  }
  var regExp = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  var match = param.match(regExp)
  return match ? decodeURIComponent(match[2]) : ''
}

export function setWechatTitle (title, img) {
  if (title === undefined || window.document.title === title) {
    return
  }
  document.title = title
  var mobile = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    // 替换成站标favicon路径或者任意存在的较小的图片即可
    iframe.setAttribute('src', img || '')
    var iframeCallback = function () {
      setTimeout(function () {
        iframe.removeEventListener('load', iframeCallback)
        document.body.removeChild(iframe)
      }, 0)
    }
    iframe.addEventListener('load', iframeCallback)
    document.body.appendChild(iframe)
  }
}

