// Created by ChazzChen on 2018/3/23
// toast插件，接受三个参数
// text => 展示的文字
// time => 展示的时长，默认为1000ms
// cb   => toast结束的回调
// 非vue页面可以引用此组件
var toastSucsZIndex = 11000

function toastSucs (text, time, cb) {
    text || (text = '已完成')
    time || (time = 2000)

    var toastSucs = document.createElement('div')
    toastSucs.className = 'toast-success'
    toastSucs.innerHTML = '<style>' +
        '.toast-success { opacity: 0; transition: opacity .1s; }' +
        '.toast-success .toast-mask-transparent { position: fixed; left: 0; right: 0; bottom: 0; top: 0; z-index: ' + toastSucsZIndex + '; }' +
        '.toast-success .toast { position: fixed; left: 50%; top: 180px; width: 2.4rem; min-height: 2.4rem; margin: 0 0 0 -1.2rem; border-radius: 5px; color: #fff; background: rgba(17, 17, 17, .7); text-align: center; z-index: ' + (++toastSucsZIndex) + '; }' +
        '.toast-success .toast-icon { display: block; height: 55px; margin: 22px 0 0 0; background: transparent url("data:image/png;base64,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") no-repeat center; background-size: 55px; }' +
        '.toast-success .toast-text { margin: 0 0 15px; font-size: .32rem; }' +
        '.opacity-1 { opacity: 1; }' +
        '</style>' +
        '<div class="toast">' +
        '<i class="toast-icon"></i>' +
        '<p class="toast-text">' + text + '</p>' +
        '</div>'

    function showToast () {
        document.body.appendChild(toastSucs);
        setTimeout(function () {
            toastSucs.className += ' opacity-1'
            hideToast()
        }, 1)
    }

    function hideToast () {
        setTimeout(function () {
            toastSucs.className = 'toast-success'
            toastSucs.addEventListener('transitionend', removeEvent)
        }, time)
    }

    function removeEvent () {
        cb && typeof cb === 'function' && cb();
        document.body.removeChild(toastSucs)
        toastSucs.removeEventListener('transitionend', removeEvent)
    }

    showToast()
}

if (typeof exports === 'object') {
    module.exports = toastSucs
}