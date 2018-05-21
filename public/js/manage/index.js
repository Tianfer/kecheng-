(function () {
  function Manage () {
    this.searchType = 'listen'
    this.$searchText = $('#searchText')
    this.$searchInput = $('#searchInput')
    this.$tbody = $('#tbody')
    this.$message = $('#message')

    this.delId = -1

    this.init()
  }

  Manage.prototype = {
    getUserInfo: function () {
      loading.show()
      var that = this
      $.ajax({
        type: 'get',
        url: '/api/getUserInfo',
        success: function (res) {
          if (res.code === 0) {
            that.setUserName(res.data.name)
            that.getCommentList()
          } else {
            loading.hide()
            toast(res.msg)
          }
        },
        error: function () {
          loading.hide()
          toast('网络异常，请稍后再试')
        }
      })
    },
    setUserName: function (name) {
      $('#name').text(name)
    },
    chooseSearchType: function () {
      var that = this
      $('#searchList').click(function (e) {
        var $target = $(e.target)
        that.$searchText.text($target.text())
        that.searchType = $target.data('type')
      })
    },
    getCommentList: function (params) {
      params || (params = {})
      var that = this
      $.ajax({
        type: 'post',
        url: '/getCommentList',
        data: params,
        success: function (res) {
          loading.hide()
          console.log(res)
          if (res.code === 0) {
            that.setCommentList(res.data)
          }
        },
        error: function () {
          loading.hide()
          toast('网络异常，请稍后再试')
        }
      })
    },
    setCommentList: function (data) {
      var html = data.map(function (item) {
        return '<tr class="js-index' + item.id + ' table-list">' +
          '<td class="table-item table-item__listen">' + '暂无' + '</td>' +
          '<td class="table-item">' + item.teacher_name + '</td>' +
          '<td class="table-item">' + item.presence + '/' + item.all_people + '</td>' +
          '<td class="table-item">' + item.attitude_score + '</td>' +
          '<td class="table-item">' + item.content_score + '</td>' +
          '<td class="table-item table-item__method">' + item.method_score + '</td>' +
          '<td class="table-item">' + item.manage_score +'</td>' +
          '<td class="table-item">' + item.effect_score + '</td>' +
          '<td class="table-item">' + item.count_score + '/' + item.count_grade + '</td>' +
          '<td class="table-item table-item__advice">' +
            '<div class="table-item__advice-text">' + item.other_advise + '</div>' +
          '</td>' +
          '<td class="table-item table-item__operate">' +
            '<a data-id="' + item.id + '" class="js-operateDel operate-del" href="javascript:;">删除</a>' +
          '</td>' +
        '</tr>'
      }).join('')
      this.$tbody.html(html)
      this.bindDelBtnClick()
    },
    bindSearchBtnClick: function () {
      var that = this
      $('#searchBtn').click(function () {
        var val = that.$searchInput.val()
        if (val) {
          var params = {
            key: that.searchType,
            val: val
          }
          that.getCommentList(params)
        } else {
          toast('请输入内容后再搜索')
        }
      })
    },
    bindDelBtnClick: function () {
      var that = this
      $('.js-operateDel').click(function (e) {
        that.delId = $(e.target).data('id')
        that.$message.addClass('show')
      })
    },
    bindMsgCloseClick: function () {
      var that = this
      $('#msgCancel').click(function () {
        that.$message.removeClass('show')
      })
      $('#msgClose').click(function () {
        that.$message.removeClass('show')
      })
    },
    bindMsgConfirmClick: function () {
      var that = this
      $('#msgConfirm').click(function () {
        that.delComment(function () {
          that.$message.removeClass('show')
        })
      })
    },
    delComment: function (cb) {
      var that = this
      $('.js-index' + that.delId).remove()
      $.ajax({
        type: 'post',
        url: '/delComment',
        data: {
          id: that.delId
        },
        success: function (res) {
          cb()
          if (res.code === 0) {
            $('.js-index' + that.delId).remove()
          } else {
            toast(res.msg)
          }
        },
        error: function () {
          toast('网络异常，请稍后再试')
        }
      })
    },
    bindExportClick: function () {
      var that = this
      $('#export').click(function () {
        that.export()
      })
    },
    export: function () {
      return ExcellentExport.excel(this, 'table', 'demo')
    },
    init: function () {
      this.getUserInfo()
      this.chooseSearchType()
      this.bindSearchBtnClick()
      this.bindMsgCloseClick()
      this.bindMsgConfirmClick()
    }
  }

  $(function () {
    var manage = new Manage()
  })
})()