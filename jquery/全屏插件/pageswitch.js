/**
 * Created by coderpwh on 2017/12/12.
 */
(function ($) {
    var privateFun = function () {
        //
    }
    
    
    var PageSwitch = (function () {
        function PageSwith (element,options) {
          this.settings = $.extend(true,$.fn.PageSwithch.defaults,options||{});
          this.element = element;
          this.init();
        }
        PageSwith.prototype = {

            init:function () {
                var me = this;
                me.selectors = me.settings.selectors;
                me.selectors = me.selectors.sections;
                me.section = me.selectors.section;
                me.direction = me.settings.direction == "vertical"? true:false;
                me.pagesCount = me.pagesCount();
                me.index = (me.settings.index>=0 && me.settings.index<pagesCount)?me.settings.index:0;
                if(!me.direction){
                    me._initLayout();
                }
                if(me.settings.pagination){
                    me._initPaging();
                }
                me._initEvent();

            },
            pageCount :function () {
                 return this.sections.length;
            },
             /** 说明:获取滑动的宽度(横屏滑动)或者高度(竖屏滑动) */
            switchLength:function () {
                return this.direction?this.element.height():this.element.width();
             },
            /**说明:向前滑动即上一页面*/
            prev:function () {
                var me = this;
                if(me.index>0){
                    me.index --;
                }else if(me.settings.loop){
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage();
            },
             /**说明: 主要针对横屏情况进行页面布局*/
            next:function () {
                var me = this;
                if(me.index<me.pagesCount){
                    me.index ++;
                }else if(me.settings.loop){
                    me.index = 0;
                }
                me._scrollPage();
            },
             /** 说明:主要针对横屏情况进行页面布局 */
            _initLayout :function () {
                var me = this;
                var width = (me.pageScount*100)+"%",
                    cellWidth = (100/me.pagesCount).toFixed(2)+"%";
                 me.sections.width(width);
                 me.section.width(cellWidth).css("float","left");
            },
            /** 说明:实现分页的dom结构及css样式 */
            _initPaging :function () {
              var me = this;
              pageClass = me.selectors.page.substring(1);
              activeClass = me.selectors.active.substring(1);

              var pageHtml = "<ul class='+pagesClass+'>"
               for(var i=0;i<me.pagesCount;i++){
                  pageHtml +="<li></li>";
               }
               me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if(me.direction){
                    pages.addClass("vertical");
                }else{
                    pages.addClass("horizontal");
                }

            },
             /**说明:初始化插件事件*/
            _initEvent:function (){
                 var me = this;
                 me.element.on("click",me.selectors.pages+"li",function () {
                     me.index = $(this).index();
                     me._scrollpage();
                 });
                 me.element.on("mousewheel DOMMouseScroll",function (e) {
                     var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                     if(delta>0&&(me.index && !me.settings.loop ||me.settings.loop)){
                         me.prev();
                     }else if(delta<0 &&(me.index<(me.pagesCount-1) && !me.settings.loop || me.settings.loop)){
                        me.next();
                     }
                 });
                 if(me.settings.keyboard){
                     $(window).on("keydown",function (e) {
                         var keyCode = e.keyCode;
                         if(keyCode==37 ||keyCode == 38){
                             me.rev();
                         }else if(keyCode == 39|| keyCode==40){
                             me.next();
                         }
                     });
                 }
                 $(window).resize(function () {
                     var  currentLength = me.switchLength(),
                         offset = me.settings.direction ? me.section.eq(me.index).offset().top:me.section.eq(me.index).offset().left;
                       if(Math.abs(offset)>currentLength/2 &&me.index<(me.pagesCount-1)){
                           me.index++;
                       }
                       if(me.index){
                           me._scrollPage();
                       }
                 });
                me.sections.on("transitioned webkitTranssitionEnd oTransitionEnd otransitionend",function(){
                     if(me.settings.callback && $.type(me.settings.callback) == "function"){
                         me.settings.callback();
                     }
                });


             }

        };
        return PageSwith;
    })(jQuery)

    $.fn.PageSwithch = function () {
        return this.each(function () {
            var me = $(this),
                instance = me.date("PageSwitch");
            if(!instance){
                instance = new PageSwitch(me,options);
                me.date("PageSwitch",instance);
            }
            if($.type(options)=="string") return instance[options]();
            $("div").PageSwithch("init");

        });
    }
    $.fn.PageSwithch.defaults = {
        selectors :{
            sections:".sections",
            section: ".section",
            page:".pages",
            active: ".active"
        },
        index:0,
        easing:"ease",
        duration:500,
        loop:false,
        pagination:true,
        keyboard :true,
        keyboard:"vertical",  // herizontal
        callback:""
    }
    $(function () {
        $("[data-PageSwitch]").PageSwithch();
    })

})(jQuery)
