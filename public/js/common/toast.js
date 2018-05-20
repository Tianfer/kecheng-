var toastZIndex = 5000

function toast (text, time, cb) {
    text || (text = '这是一个toast')
    time || (time = 1000)

    var toast = document.createElement('div')
    toast.className = 'toast-wrap'
    toast.id = 'SpToast'
    toast.innerHTML = '<style>' +
        '.toast-wrap { opacity: 0; position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: ' + (toastZIndex++) + '; transition: opacity .3s; }' +
        '.toast { height: 50px; line-height: 50px; margin: 180px 0 0 0; text-align: center; }' +
        '.toast-text { display: inline-block; overflow: hidden; text-overflow: ellipsis; max-width: 325px; height: inherit; line-height: inherit; padding: 0 10px; font-size: 16px; background: rgba(17, 17, 17, 0.7); color: #fff; border-radius: 5px; }' +
        '.opacity-1 { opacity: 1; }' +
        '</style>' +
        '<div class="toast">' +
        '<span id="SpToastText" class="toast-text">' + text + '</span>' +
        '</div>'

    function showToast () {
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.className += ' opacity-1'
            hideToast()
        }, 1)
    }

    function hideToast () {
        setTimeout(function () {
            toast.className = 'toast-wrap'
            toast.addEventListener('transitionend', removeEvent)
        }, time)
    }

    function removeEvent () {
        cb && typeof cb === 'function' && cb();
        document.body.removeChild(toast)
        toast.removeEventListener('transitionend', removeEvent)
    }

    showToast()
}