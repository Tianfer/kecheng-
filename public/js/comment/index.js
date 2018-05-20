(function () {
  function Comment () {
    this.$form = $('#form')
    this.$submitBtn = $('#submit'),
    this.$sliderInput = [$('#sliderInput0'), $('#sliderInput1'), $('#sliderInput2'), $('#sliderInput3'), $('#sliderInput4')]
    this.$countScore = $('#countScore')
    this.$countGrade = $('#countGrade')
    this.courseInfo = {}
    this.init()
  }
  Comment.prototype = {
    parse: function (val) {
      if (/^\d+$/.test(val)) {
        return +val
      } else {
        return decodeURI(val)
      }
    },
    assign: function (a, b) {
      for (var key in b) {
        a[key] = b[key]
      }
      return a
    },
    bindSubmitClick: function () {
      var that = this
      this.$submitBtn.click(function () {
        var str = that.$form.serialize()
        var len = 0
        var obj = {}
        str.split('&').map(function (item, index) {
          var itemArr = item.split('=')
          var key = itemArr[0]
          var val = itemArr[1]
          obj[key] = that.parse(val)
          if (val === '' && index < 10) {
            $('#input' + index).addClass('require')
            len++
          } else {
            $('#input' + index).removeClass('require')
          }
        })
        if (len === 0) {
          obj = that.assign(obj, that.courseInfo)
          that.submit(obj)
        } else {
          toast('请将信息填写完整')
        }
      })
    },
    submit: function (params) {
      loading.show()
      $.ajax({
        url: '/commentCourse',
        type: 'POST',
        data: params,
        success: function (res) {
          loading.hide()
          if (res.code === 0) {
            location.replace('/comment_success')
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
    getCourseInfo: function (cb) {
      loading.show()
      var id = location.search.slice(1).split('=')[1]
      var that = this
      $.ajax({
        url: '/getCourse/' + id,
        success: function (res) {
          console.log(res)
          loading.hide()
          if (res.code === 0) {
            cb(res.data)
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
    setCourseInfo: function () {
      var that = this
      this.getCourseInfo(function (data) {
        $('#courseName').val(data.source_name)
        $('#teacherName').val(data.teacher_name)
        $('#className').val(data.class_name)
        $('#place').val(data.building + ' ' + data.address)
        $('#classes').text(that.parseTimeDetail(data.time))
        that.saveCourseInfo(data)
      })
    },
    saveCourseInfo (data) {
      this.courseInfo = {
        class_id: data.ID,
        time_detail: data.time,
        building: data.building,
        classroom: data.address,
        time_day: data.day,
        time_week: data.week,
        grade: data.grade,
        course_id: data.source_id,
        teacher_id: 22,
        teacher_name: data.teacher_name,
        class_name: data.class_name,
        course_name: data.source_name
      }
      console.log('teacher_id记得改回去')
    },
    parseTimeDetail: function (timeDetail) {
      var arr = timeDetail.split('')
      if (arr[2] === '1') {
        return '第9.10节'
      } else {
        return '第' + arr[1] + '.' + arr[3] + '节'
      }
    },
    initSlider: function () {
      console.log('initSlider')
      for (var i = 0; i < 5; i++) {
        (function (that, i) {
          $('#slider' + i).slider(function (percent) {
            var sliderInput = that.$sliderInput[i]
            var score = Math.floor(percent / 100 * sliderInput.data('total'))
            sliderInput.val(score)
            $('#sliderValue' + i).text(score)
            that.updateCountScore()
          })
        }(this, i))
      }
    },
    updateCountScore: function () {
      var score = 0
      for (var i = 0; i < 5; i++) {
        score += +this.$sliderInput[i].val()
      }
      this.$countScore.val(score)
      this.updateCountGrade(score)
    },
    updateCountGrade: function (score) {
      var grade = ''
      if (score < 60) {
        grade = 'D'
      } else if (score < 75) {
        grade = 'C'
      } else if (score < 90) {
        grade = 'B'
      } else {
        grade = 'A'
      }
      this.$countGrade.val(grade)
    },
    watchAdviseLen: function () {
      var $adviseLen = $('#adviseLen')
      $('#otherAdvise').on('input', function () {
        $adviseLen.text($(this).val().length)
      })
    },
    getConfig: function () {
      // $.ajax({
      //   type
      // })
    },
    wechatConfig: function () {
      wx.config({
        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，企业微信的corpID
        timestamp: Date.now(), // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
    },
    init: function () {
      this.setCourseInfo()
      this.bindSubmitClick()
      this.initSlider()
      this.watchAdviseLen()
      this.getConfig()
      this.wechatConfig()
    }
  }

  $(function () {
    var comment = new Comment()
  })
}())