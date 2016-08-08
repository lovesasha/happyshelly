/**
 * Copyright 2016 Sasha
 * 移动端全屏滑动分页效果
 * ------------------------------------------------
 * author:  Sasha
 * version: 0.0.1
 */
(function($) {
    var PageSlide = (function() {
        function PageSlide(elem, options) {
            this.settings = $.extend(true, $.fn.PageSlide.defaults, options || {});
            this.element = elem;
            this.init();
        }
        PageSlide.prototype = {
            init: function () {
                var me = this;

                window.onload = function() {
                    // init variables
                    me.index = me.settings.index;
                    me.active = me.settings.active;
                    me.duration = me.settings.duration;
                    me.sections = me.element.children(me.settings.section);
                    //me.activeSection = me.element.children(me.settings.section + '.' + me.settings.active);
                    me.activeSection = me.sections.eq(me.index);
                    me.prevSection = me.activeSection.prev(me.settings.section);
                    me.nextSection = me.activeSection.next(me.settings.section);

                    me.sections.eq(me.index).addClass(me.active).css({'z-index': 999});
                    //console.log(me.activeSection.siblings(me.settings.section));
                    me._initSlide();
                }
            },
            _initSlide: function() {
                var me = this;
                var startY, deltaY;
                var height = me.element.height(),
                    minDelta = height / 4;  // 触发上滑的最小距离
                /*var sections = me.element.children(me.settings.section),
                    activeSection = me.element.children(me.settings.section + '.' + me.settings.active),
                    nextSection = activeSection.next(me.settings.section);
                    nextSection.css({'z-index': 1000});*/
                var duration = me.settings.duration;
                var direction,              // 滑动方向
                    directionUnlock = true, // 滑动锁
                    transiting = false;     // 动画过渡中

                // 上滑处理函数
                var slideUpHandler = function() {
                    me.nextSection.css({
                        '-webkit-transform': 'translateY(' + -deltaY + 'px)',
                        'transform': 'translateY(' + -deltaY + 'px)'
                    });
                };
                // 下滑处理函数
                var slideDownHandler = function() {
                    me.activeSection.css({
                        '-webkit-transform': 'translateY(' + -(deltaY + height) + 'px)',
                        'transform': 'translateY(' + -(deltaY + height) + 'px)'
                    });
                };

                $.each(me.sections, function(index, elem) {
                    elem.addEventListener('touchstart', function(e) {
                        startY = e.touches[0].pageY;
                    });
                    elem.addEventListener('touchmove', function(e) {
                        if (transiting) return;
                        e.preventDefault();
                        deltaY = startY - e.touches[0].pageY;
                        if (directionUnlock) {
                            directionUnlock = false;
                            direction = deltaY > 0 ? 'up' : 'down';
                        }
                        switch(direction) {
                        case 'up':
                            slideUpHandler();
                            break;
                        case 'down':
                            slideDownHandler();
                            break;
                        }
                    });
                    elem.addEventListener('touchend', function(e) {
                        directionUnlock = true;
                        transiting = true;

                        var section,
                            dy = Math.abs(deltaY),
                            isPageSlided = false;
                        switch(direction) {
                        case 'up':
                            section = me.nextSection;
                            /*if (dy >= minDelta) {
                                me.nextSection.css({
                                    '-webkit-transform': 'translateY(' + -height + 'px)',
                                    'transform': 'translateY(' + -height + 'px)',
                                    'transition': duration + 'ms'
                                });
                                isPageSlided = true;
                            } else {
                                me.nextSection.css({
                                    '-webkit-transform': 'translateY(0)',
                                    'transform': 'translateY(0)',
                                    'transition': duration + 'ms'
                                });
                            }*/
                            break;
                        case 'down':
                            section = me.activeSection;
                            /*if (dy >= minDelta) {

                            } else {

                            }*/
                            break;
                        }
                        if (dy >= minDelta) {
                            section.css({
                                '-webkit-transform': 'translateY(' + -height + 'px)',
                                'transform': 'translateY(' + -height + 'px)',
                                'transition': duration + 'ms'
                            });
                            isPageSlided = true;
                        } else {
                            section.css({
                                '-webkit-transform': 'translateY(0)',
                                'transform': 'translateY(0)',
                                'transition': duration + 'ms'
                            });
                        }

                        section.one('webkitTransitionEnd transitionend', function(){
                            transiting = false;
                            section.css({'transition': 'initial'});
                            if (isPageSlided) me._resetSection();
                        });
                        setTimeout(function() {
                            transiting = false;
                            section.css({'transition': 'initial'});
                        }, duration)
                    });
                });
            },
            _resetSection: function() {
                var me = this;
                me.prevSection = me.activeSection.removeClass(me.active);
                me.activeSection = me.nextSection.addClass(me.active).css({'z-index': 999});
                me.nextSection = me.activeSection.next(me.settings.section).css({'z-index': 1000});
            },
            _resetPrevSection: function() {

            }
        };
        return PageSlide;
    })();

    $.fn.PageSlide = function(options) {
        return this.each(function() {
            var me = $(this);
            var instance = me.data('pageslide');
            if (! instance) {
                instance = new PageSlide(me, options);
                me.data('pageslide', instance);
            }
            if ($.type(options) === 'string') return instance;
        });
    };

    $.fn.PageSlide.defaults = {
        index: 0,
        section: '.main-page',
        active: 'active',
        easing: 'ease',
        duration: 600
    };

}(jQuery));