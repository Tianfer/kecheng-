import '../lib/jq.min.js'
import loading from '../common/loading.js'
import toast from '../common/toast.js'

var course = (function () {
  function transWeek(text) {
    switch (text) {
      case '第1周' :
        return 1;
        break;
      case '第2周' :
        return 2;
        break;
      case '第3周' :
        return 3;
        break;
      case '第4周' :
        return 4;
        break;
      case '第5周' :
        return 5;
        break;
      case '第6周' :
        return 6;
        break;
      case '第7周' :
        return 7;
        break;
      case '第8周' :
        return 8;
        break;
      case '第9周' :
        return 9;
        break;
      case '第10周' :
        return 10;
        break;
      case '第11周' :
        return 11;
        break;
      case '第12周' :
        return 12;
        break;
      case '第13周' :
        return 13;
        break;
      case '第14周' :
        return 14;
        break;
      case '第15周' :
        return 15;
        break;
      case '第16周' :
        return 16;
        break;
      case '第17周' :
        return 17;
        break;
      case '第18周' :
        return 18;
        break;
    }
  }
  function transDay(text) {
    switch (text) {
      case '周一' :
        return 1;
        break;
      case '周二' :
        return 2;
        break;
      case '周三' :
        return 3;
        break;
      case '周四' :
        return 4;
        break;
      case '周五' :
        return 5;
        break;
      case '周六' :
        return 6;
        break;
      case '周日' :
        return 7;
        break;
    }
  }
  function Course () {
    this.building;
    this.week;
    this.day;
  }
  Course.prototype = {
    set: function (key, value, kind) {
      if (kind == 'building') {
        this[key] = '十教东附楼' == value ? '第十教学楼东附楼' : value;
      } else if (kind == 'week') {
        this[key] = transWeek(value);
      } else {
        this[key] = transDay(value);
      }
    },
    check: function () {
      if ((typeof this.building != 'undefined') &&
        (typeof this.week != 'undefined') &&
        (typeof this.day != 'undefined')) {
        return true;
      }
      return false;
    },
    render: function (data) {
      if (data['1-2'] && data['1-2'].length) {
        $('#tabular1-2').html('');
        this.template(data['1-2'], 'tabular1-2');
      } else {
        this.notTemplate('tabular1-2');
      }

      if (data['3-4'] && data['3-4'].length) {
        $('#tabular3-4').html('');
        this.template(data['3-4'], 'tabular3-4');
      } else {
        this.notTemplate('tabular3-4');
      }

      if (data['5-6'] && data['5-6'].length) {
        $('#tabular5-6').html('');
        this.template(data['5-6'], 'tabular5-6');
      } else {
        this.notTemplate('tabular5-6');
      }

      if (data['7-8'] && data['7-8'].length) {
        $('#tabular7-8').html('');
        this.template(data['7-8'], 'tabular7-8');
      } else {
        this.notTemplate('tabular7-8');
      }

      if (data['9-10'] && data['9-10'].length) {
        $('#tabular9-10').html('');
        this.template(data['9-10'], 'tabular9-10');
      } else {
        this.notTemplate('tabular9-10');
      }
    },
    template: function (data, id) {
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push('<a href="/comment?id='+ data[i]['ID'] +'" class="ui vertical segment" style="display: block;">'+
              '    <div class="ui teal ribbon label">'+data[i]['teacher_name']+'</div>'+
              '    <div class="ui divided relaxed list">'+
              '      <div class="item">'+
              '        <div class="ui divided selection list">'+
              '          '+
              '          <div class="item">'+
              '            <div class="ui teal horizontal label">'+
              '              <i class="book icon"></i> 课程'+
              '            </div>'+
              '            <span ng-bind="per.course">'+data[i]['source_name']+'</span>'+
              '          </div>'+
              '          <div class="item">'+
              '            <div class="ui orange horizontal label">'+
              '              <i class="building icon"></i> 教室'+
              '            </div>'+
              '            <span ng-bind="per.classroom">'+data[i]['building']+data[i]['address']+'</span>'+
              '          </div>'+
              '          <div class="item">'+
              '            <div class="ui green horizontal label">'+
              '              <i class="building icon"></i> 年级'+
              '            </div>'+
              '            <span ng-bind="per.classroom">'+data[i]['grade']+'</span>'+
              '          </div>'+
              '          <div class="item" ng-if="per.class">'+
              '            <div class="ui red horizontal label">'+
              '              <i class="building icon"></i> 班级'+
              '            </div>'+
              '            <span ng-bind="per.class">'+data[i]['class_name']+'</span>'+
              '          </div>'+
              '        </div>'+
              '      </div>'+
              '    </div>'+
              '  </a>');
      }
      $('#'+id).append(arr.join(''));
    },
    notTemplate: function (id) {
      var template = '<div class="ui info message" ng-if="!hasCourse(data[day])">'+
           ' 无老师上课。'+
          '</div>';
        $('#'+id).html(template);
    }
  }
  return new Course();
})();

$(function() {
  $('.ui.dropdown').dropdown({
    onChange: function(value, text, $selectedItem) {
      var target = event.target || window.event.target;
      var kind = target.getAttribute('data-name');
      course.set(kind, text, kind);
      if (course.check()) {
        loading.show()
        $.ajax({
          type:'get',
          url:'/getCourses',
          data:{
            building: course.building,
            week: course.week,
            day: course.day
          },
          success: function(res) {
            loading.hide()
            if (res.code === 0) {
              course.render(res.data);
            } else {
              toast(res.msg)
            }
          },
          error: function(err) {
            loading.hide()
            toast('网络异常，请稍后再试')
          }
        });
      }
    }
  });
  $('.tabular.menu .item').tab();
})