import loading from '../common/loading.js'
import toast from '../common/toast.js'

(function () {
  function Manage () {
    this.searchType = 'listen'
    this.$searchText = $('#searchText')
    this.$searchInput = $('#searchInput')
    this.$tbody = $('#tbody')
    this.$message = $('#message')

    this.delId = -1,
    this.currentPage = 1
    this.count = 0

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
            that.getCommentList()
            that.setUserName(res.data.name)
            that.bindLogoutClick()
          } else if (res.code === 403) {
            location.href = '/manage'
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
    bindLogoutClick: function () {
      $('#logout').click(function () {
        $.ajax({
          type: 'get',
          url: '/api/logout',
          success: function (res) {
            if (res.code === 0) {
              location.href = '/manage'
            }
          }
        })
      })
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
      params.currentPage = this.currentPage
      var that = this
      $.ajax({
        type: 'post',
        url: '/api/getCommentList',
        data: params,
        success: function (res) {
          loading.hide()
          console.log(res)
          if (res.code === 0) {
            that.setCommentList(res.data.list)
            if (!that.count) {
              that.initPaginator(res.data.count)
            }
          } else {
            toast(res.msg)
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
          '<td class="table-item table-item__listen">' + item.comment_teacher_name + '</td>' +
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
    bindExportClick: function (e) {
      var that = this
      $('#export').click(function () {
        var html = "<html><head><meta charset='utf-8' /></head><body>"
          + document.getElementById('table').outerHTML
          + "</body></html>";
        var blob = new Blob([html], {
          type: 'application/vnd.ms-excel'
        })
        $(this).attr('href', URL.createObjectURL(blob))
          .attr('download', '听课评价表.xls')
      })
    },
    initPaginator: function (count) {
      this.count = count
      var that = this
      $('#paginator').jqPaginator({
        totalPages: Math.ceil(count / 10),
        onPageChange: function (num) {
          console.log(num)
          if (num !== that.currentPage) {
            that.currentPage = num
            var val = that.$searchInput.val()
            if (val) {
              that.getCommentList({
                key: that.searchType,
                val: val
              })
            } else {
              that.getCommentList()
            }
          }
        }
      })
    },
    init: function () {
      this.getUserInfo()
      this.chooseSearchType()
      this.bindSearchBtnClick()
      this.bindMsgCloseClick()
      this.bindMsgConfirmClick()
      this.bindExportClick()
    }
  }

  $(function () {
    var manage = new Manage()
  })
})()