var loading = {
    isExist: false,
    zIndex: 11000,
    Sploading: null,
    len: 0,
    creat: function () {
        var loading = document.createElement('div')
        loading.className = 'loading-wrap'
        loading.id = 'Sploading'
        loading.innerHTML = '<div class="loading">' +
            '<style>' +
            '.loading-wrap { display: none; opacity: 0; transition: opacity .1s linear; position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: ' + this.zIndex + ';}' +
            '.loading { position: fixed; left: 50%; top: 180px; width: 120px; min-height: 120px; margin: 0 0 0 -60px; border-radius: 5px; color: #fff; background: rgba(17, 17, 17, .7); text-align: center; overflow: hidden; }' +
            '.loading-icon { display: inline-block; width: 38px; height: 38px; margin: 30px 0 0 0; background: transparent url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=") no-repeat center; background-size: 100%; -webkit-animation: loading 1s infinite steps(12, end); animation: loading 1s infinite steps(12, end); }' +
            '@keyframes loading { from { -webkit-transform: rotate3d(0, 0, 1, 0deg); transform: rotate3d(0, 0, 1, 0deg); } to { -webkit-transform: rotate3d(0, 0, 1, 360deg); transform: rotate3d(0, 0, 1, 360deg); } }' +
            '.loading-text { font-size: 13px; margin: -5px 0 15px; }' +
            '.loading-Dshow { display: block }' +
            '.loading-Oshow { opacity: 1; }' +
            '</style>' +
            '<i class="loading-icon"></i>' +
            '<p class="loading-text">数据加载中</p>' +
            '</div>'
        document.body.appendChild(loading)
        this.isExist = true
        this.Sploading = loading
        this.show()
    },
    show: function () {
        // 如果存在，则直接用存在的
        if (this.isExist) {
            var that = this
            this.Sploading.className += ' loading-Dshow'
            this.startTime = Date.now()
            this.len++
            setTimeout(function () {
                that.Sploading.className += ' loading-Oshow'
            }, 1)
        } else {
            this.creat()
        }
    },
    hide: function () {
        // 防止在没有调用show时就调用hide
        if (this.len > 0) {
            this.len--
            // 多个show时，需要对应同等个的hide才能隐藏loading
            if (this.len === 0) {
                if (Date.now() - this.startTime > 300) {
                    this.Sploading.className = 'loading-wrap loading-Dshow'
                    this.Sploading.addEventListener('transitionend', this.removeEvent(this))
                } else {
                    // 如果接口很快返回，就等待一段时间再hide，避免出现闪一下的情况
                    var that = this
                    this.st = setTimeout(function () {
                        that.len++
                        that.hide()
                    }, 300 - (Date.now() - this.startTime))
                }
            }
        }

    },
    removeEvent: function (that) {
        that.Sploading.className = 'loading-wrap'
        that.Sploading.removeEventListener('transitionend', this.removeEvent)
    },
    remove: function () {
        document.body.removeChild(this.Sploading)
        this.isExist = false
        this.Sploading = null
    }
}

if (typeof exports === 'object') {
    module.exports = loading
}