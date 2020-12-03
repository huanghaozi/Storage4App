// ��ߵ���Ŀ¼
jQuery(function($) {
	$(document).ready(function() {
		var contentButton = [];
		var contentTop = [];
		var content = [];
		var lastScrollTop = 0;
		var scrollDir = '';
		var itemClass = '';
		var itemHover = '';
		var menuSize = null;
		var stickyHeight = 0;
		var stickyMarginB = 0;
		var currentMarginT = 0;
		var topMargin = 0;
		var vartop = 0;
		$(window).scroll(function(event) {
			var st = $(this).scrollTop();
			if (st > lastScrollTop) {
				scrollDir = 'down';
			} else {
				scrollDir = 'up';
			}
			lastScrollTop = st;
		});
		$.fn.stickUp = function(options) {
			$(this).addClass('stuckMenu');
			var objn = 0;
			if (options != null) {
				for (var o in options.parts) {
					if (options.parts.hasOwnProperty(o)) {
						content[objn] = options.parts[objn];
						objn++;
					}
				}
				if (objn == 0) {
					console.log('error:needs arguments');
				}
				itemClass = options.itemClass;
				itemHover = options.itemHover;
				if (options.topMargin != null) {
					if (options.topMargin == 'auto') {
						topMargin = parseInt($('.stuckMenu').css('margin-top')) + 70;
					} else {
						if (isNaN(options.topMargin) && options.topMargin.search("px") > 0) {
							topMargin = parseInt(options.topMargin.replace("px", ""));
						} else if (!isNaN(parseInt(options.topMargin))) {
							topMargin = parseInt(options.topMargin);
						} else {
							console.log("incorrect argument, ignored.");
							topMargin = 0;
						}
					}
				} else {
					topMargin = 0;
				}
				menuSize = $('.' + itemClass).size();
			}
			stickyHeight = parseInt($(this).height());
			stickyMarginB = parseInt($(this).css('margin-bottom'));
			currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));
			vartop = parseInt($(this).offset().top);
		};
		$(document).on('scroll', function() {
			varscroll = parseInt($(document).scrollTop());
			if (menuSize != null) {
				for (var i = 0; i < menuSize; i++) {
					contentTop[i] = $('#' + content[i] + '').offset().top;

					function bottomView(i) {
						contentView = $('#' + content[i] + '').height() * .4;
						testView = contentTop[i] - contentView;
						if (varscroll > testView) {
							$('.' + itemClass).removeClass(itemHover);
							$('.' + itemClass + ':eq(' + i + ')').addClass(itemHover);
						} else if (varscroll < 50) {
							$('.' + itemClass).removeClass(itemHover);
							$('.' + itemClass + ':eq(0)').addClass(itemHover);
						}
					}
					if (scrollDir == 'down' && varscroll > contentTop[i] - 50 && varscroll < contentTop[i] + 50) {
						$('.' + itemClass).removeClass(itemHover);
						$('.' + itemClass + ':eq(' + i + ')').addClass(itemHover);
					}
					if (scrollDir == 'up') {
						bottomView(i);
					}
				}
			}
			if (vartop < varscroll + topMargin) {
				$('.stuckMenu').addClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position", "fixed");
				$('.isStuck').css({
					top: '0px'
				}, 10, function() {});
			} else {
				$('.stuckMenu').removeClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position", "relative");
			};
		});
	});
});

function loadScroller() {
	if ($("#topics").length > 0) {
		//�Ȼ�ȡ��һ��h��ǩ, ֮��ѭ��ʱ��Ϊ��һ��h��ǩ
		var $ph = $('#cnblogs_post_body :header:eq(0)');
		if ($ph.length > 0) {
			$('#sideBarMain').remove();
			//���ò㼶Ϊ1
			$ph.attr('offset', '1');
			//��ӵ���Ŀ¼������
			$('#sideBar').append(
				'<div id="sidebar_scroller" class="catListPostArchive sidebar-block"><h3 class="catListTitle">����Ŀ¼</h3><ul class="nav"></ul></div>'
			);
			//ȡ��ǰ�����Ŀ��
			$('#sidebar_scroller').css('width', ($('#sideBar').width()) + 'px');
			//�õ���Ŀ¼ͣ����ҳ�涥��
			$('#sidebar_scroller').stickUp();
			//����������ÿ��h��ǩ
			$('#cnblogs_post_body :header').each(function(i) {
				var $h = $(this);
				//����h��ǩ��id, ��Ŵ�0��ʼ
				$h.attr('id', 'scroller-' + i);
				//����һ��h��ǩ�㼶С, ������1
				if ($h[0].tagName > $ph[0].tagName) {
					$h.attr('offset', parseInt($ph.attr('offset')) + 1);
				} //����һ��h��ǩ�㼶��, ������1
				else if ($h[0].tagName < $ph[0].tagName) {

					var h = parseInt($h[0].tagName.substring(1));
					var ph = parseInt($ph[0].tagName.substring(1));

					var offset = parseInt($ph.attr('offset')) - (ph - h);
					if (offset < 1) {
						offset = 1
					};
					$h.attr('offset', offset);
				} //����һ��h��ǩ�㼶���ʱ, ��������
				else {
					$h.attr('offset', $ph.attr('offset'));
				}
				//���h��ǩ��Ŀ¼����
				$('#sidebar_scroller ul').append('<li class="scroller-offset' + $h.attr('offset') + '"><a href="#scroller-' +
					i +
					'">' + $h.text() + '</a></li>');
				//��������Լ�Ϊ��һ��h��ǩ
				$ph = $h;
			});

			//������������, ����������.nav���µ�li
			$('body').scrollspy();

		} else {
			$('#sideBar').css('display', 'none');
			$('#main').css('grid-template-columns', '100%');
		}
	}
}

function setPostSideBar() {
	setTimeout(function() {
		loadScroller();
	}, 20);
}

// ���ò����ڲ�������
function tableScorll() {
	if ($("#topics") != null) {
		$("table").each(function() {
			$(this).css('display', 'table');
			$(this).wrapAll('<div class="tablebox"></div>');
			$(".tablebox").css('overflow', 'auto');
		});
	}
};


// �����ڲ�����鸴��
function copyCode() {
	if ($("#topics") != null) {
		for (i = 0; i <= $('pre').length; i++) {
			$('pre').eq(i).before('<p class="clipboard-button" id="copy_btn_' + i + ' " data-clipboard-target="#copy_target_' +
				i + '"title="���ƴ���">���ƴ���</p>');

			$('pre').eq(i).attr('id', 'copy_target_' + i);
		}
		$('.clipboard-button').css({
			"padding": "-2px",
			"text-align": "right",
			"user-select": " none"
		})

		var clipboard = new ClipboardJS('.clipboard-button');
		clipboard.on('success', function(e) {

			e.trigger.innerHTML = '���Ƴɹ�';
			setTimeout(function() {
				e.trigger.innerHTML = '���ƴ���';
			}, 2 * 1000);

			e.clearSelection();
		});

		clipboard.on('error', function(e) {
			e.trigger.innerHTML = '����ʧ�ܣ�';
			setTimeout(function() {
				e.trigger.innerHTML = '���ƴ���';
			}, 2 * 1000);

			e.clearSelection();
		});
	}
};

// ���ò����ڲ������´��ڴ�
function blankTarget() {
	if ($("#topics") != null) {
		$('#cnblogs_post_body a[href^="http"]').each(function() {
			$(this).attr('target', '_blank');
		});
	}
}


// ��Ƶ����
function jiexi1() {
	var url = document.getElementById("url").value;
	document.getElementById("iframe_jiexi").src = "https://api.sigujx.com/?url=" + url;
}

function jiexi2() {
	var url = document.getElementById("url").value;
	document.getElementById("iframe_jiexi").src = "https://jx.lache.me/cc/?url=" + url;
}

function jiexi3() {
	var url = document.getElementById("url").value;
	document.getElementById("iframe_jiexi").src = "https://jx.618g.com/?url=" + url;
}

// ����������ͷ��
function commentAvatar() {
	$(document).ajaxComplete(function(event, xhr, option) {
		//����ͷ��
		if (option.url.indexOf("GetComments") > -1) {
			setTimeout(function() {
				$.each($(".blog_comment_body"), function(index, ele) {
					var self = $(ele);
					var id = self.attr("id").split("_")[2];
					var imgSrc = $("#comment_" + id + "_avatar").html() || "http://pic.cnblogs.com/avatar/simple_avatar.gif";
					self.before('<img src="' + imgSrc + '" style="float:left;" class="comment_avatar">');
					$(".comment_avatar").css({
						'width': '30px',
						'height': '30px',
						'margin': '20px 10px 20px 0',
						'border-radius': '50%'
					});
				});
			}, 200)
		};
	});
}
commentAvatar();


// �����ֻ���Ŀ¼������
function loadMobileContent() {
	var w = document.body.clientWidth;
	if ((w <= 361) && ($('#sidebar_scroller') != null)) {
		$('#cnblogs_post_body').append(
			'<div class="mytoolbar"><ul id="toolbtn"><li id="back-up"><a href="#top" ><i class="fa fa-chevron-up" aria-hidden="true"></i></a></li><li onclick="showContent()" id=mycontent""><i class="fa fa-list-ul" aria-hidden="true"></i></li><li id="back-down"><a href="#footer" ><i class="fa fa-chevron-down" aria-hidden="true"></i></a></li></ul></div>'
		);
	}
}

function showContent() {

	if ($('#sidebar_scroller').css('display') == 'none') {
		$('#sidebar_scroller').css('display', 'block');
	} else {
		$('#sidebar_scroller').css('display', 'none');
	}
}


// ��������չ
function extendNav(mynav) {
	var str = '';
	for (var i = 0; i < mynav.length; i++) {
		str = str + '<li><a id="' + mynav[i].id + '" class="menu" href="' + mynav[i].url + '">' + mynav[i].title +
			'</a></li>';
	}
	$('#navList').append(str);
}

// ������ҳ�ֲ�
function loadBanner(mybanner) {
	var str1 = '',
		str2 = '',
		str = '';
	for (var i = 0; i < mybanner.length; i++) {
		str1 = str1 + '<li>' + '<a href="' + mybanner[i].url + '" target=" _blank">' +
			'<img src="' + mybanner[i].img + '" alt="" />' +
			'</a>' +
			'<span class="title">' + mybanner[i].title + '</span>' +
			'</li>';
	}
	for (var i = 2; i <= mybanner.length; i++) {
		str2 = str2 + '<li>' + i + '</li>';
	}




	str = '<div class="comiis_wrapad" id="slideContainer">' +
		'<div id="frameHlicAe" class="frame cl">' +
		'<div class="temp"></div>' +
		'<div class="block">' +
		'<div class="cl">' +
		'<ul class="slideshow" id="slidesImgs">' +
		str1 +
		'</ul>' +
		'</div>' +
		'<div class="slidebar" id="slideBar">' +
		'<ul>' +
		'<li class="on">1</li>' +
		str2 +
		'</ul>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';

	if ($('.day').length > 0) {
		$('.forFlow').prepend($(str)) //��ҳ�ֲ�
	}

	function SlideShow(c) {
		var a = document.getElementById("slideContainer"),
			f = document.getElementById("slidesImgs").getElementsByTagName("li"),
			h = document.getElementById("slideBar"),
			n = h.getElementsByTagName("li"),
			d = f.length,
			c = c || 3000,
			e = lastI = 0,
			j, m;

		function b() {
			m = setInterval(function() {
				e = e + 1 >= d ? e + 1 - d : e + 1;
				g()
			}, c)
		}

		function k() {
			clearInterval(m)
		}

		function g() {
			f[lastI].style.display = "none";
			n[lastI].className = "";
			f[e].style.display = "block";
			n[e].className = "on";
			lastI = e
		}
		f[e].style.display = "block";
		a.onmouseover = k;
		a.onmouseout = b;
		h.onmouseover = function(i) {
			j = i ? i.target : window.event.srcElement;
			if (j.nodeName === "LI") {
				e = parseInt(j.innerHTML, 10) - 1;
				g()
			}
		};
		b()
	};

	if ($('.day').length > 0) {
		SlideShow(3000);
	}

}
// ������ҳtabͼ��
function setFavio(myprofile) {
	$('head').append($('<link rel="shortcut icon" type="image/x-icon"/>').attr('href', myprofile[0].blogAvatar));
};


//���нű�
function runCode() {
	$(function() {
		$('myscript').each(function() {
			$(this).css('display', 'none');
			eval($(this).text());
		});
	});
}


// ����/��ȡ cookie
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires + ";secure; path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}



var Theme = {
	Light: {
		'color': '#141418',
		'TextColor1': '#141418',
		'TextColor2': '#5f5f6b',
		'TextColor3': '#97979f',
		'DividColor': '#e7eaf0',
		'BackgroundColor': '#f4f6fa',
		'BlockColor': '#ffffff'
	},
	Dark: {
		'color': '#cfcecf',
		'TextColor1': '#cfcecf',
		'TextColor2': '#89888c',
		'TextColor3': '#57565a',
		'DividColor': '#323236',
		'BackgroundColor': '#282c34',
		'BlockColor': '#20242b'
	}
}

function changeThemeColor(Light) {
	setCookie('color', Light.color, 30);
	setCookie('TextColor1', Light.TextColor1, 30);
	setCookie('TextColor2', Light.TextColor2, 30);
	setCookie('TextColor3', Light.TextColor3, 30);
	setCookie('DividColor', Light.DividColor, 30);
	setCookie('BackgroundColor', Light.BackgroundColor, 30);
	setCookie('BlockColor', Light.BlockColor, 30);
	$('html').css("color", getCookie("color"));
	document.documentElement.style.setProperty("--TextColor1", getCookie("TextColor1"));
	document.documentElement.style.setProperty("--TextColor2", getCookie("TextColor2"));
	document.documentElement.style.setProperty("--TextColor3", getCookie("TextColor3"));
	document.documentElement.style.setProperty("--DividColor", getCookie("DividColor"));
	document.documentElement.style.setProperty("--BackgroundColor", getCookie("BackgroundColor"));
	document.documentElement.style.setProperty("--BlockColor", getCookie("BlockColor"));
}


// �л�����
function changeTheme() {
	if ($('html').css('color') == 'rgb(20, 20, 24)') {
		changeThemeColor(Theme.Dark);
	} else {
		changeThemeColor(Theme.Light);
	}
}

function loadThemeColor() {
	if (getCookie("color") == "") {
		$('html').css("color", getCookie("#141418"));
		document.documentElement.style.setProperty("--TextColor1", "#141418");
		document.documentElement.style.setProperty("--TextColor2", "#5f5f6b");
		document.documentElement.style.setProperty("--TextColor3", "#97979f");
		document.documentElement.style.setProperty("--DividColor", "#e7eaf0");
		document.documentElement.style.setProperty("--BackgroundColor", "#f4f6fa");
		document.documentElement.style.setProperty("--BlockColor", "#ffffff");
	} else {
		$('html').css("color", getCookie("color"));
		document.documentElement.style.setProperty("--TextColor1", getCookie("TextColor1"));
		document.documentElement.style.setProperty("--TextColor2", getCookie("TextColor2"));
		document.documentElement.style.setProperty("--TextColor3", getCookie("TextColor3"));
		document.documentElement.style.setProperty("--DividColor", getCookie("DividColor"));
		document.documentElement.style.setProperty("--BackgroundColor", getCookie("BackgroundColor"));
		document.documentElement.style.setProperty("--BlockColor", getCookie("BlockColor"));
	}
}

// �Զ���markdown 
function mymd() {
	var d = document;
	var cnblogs_post_body = d.getElementById('cnblogs_post_body');

	if (cnblogs_post_body != null) {
		var html = d.getElementById('cnblogs_post_body').innerHTML;
		html = md2video(html);
		html = md2music(html);
		d.getElementById('cnblogs_post_body').innerHTML = html;
	}

	// �Զ�����Ƶ�﷨
	function md2video(str) {
		var video_str1 = '<div class="video"><iframe src="';
		var video_str2 =
			'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe></div>';
		return str.replace(/\<p\>\{video\}\(([^{}()]+)\)\<\/p\>/g, function(match, $1) {
			return video_str1 + $1 + video_str2
		});
	}
	// �Զ��������﷨
	function md2music(str) {
		var music_str1 = '<div class="music"><iframe src="';
		var music_str2 =
			'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe></div>';
		return str.replace(/\<p\>\{music\}\(([^{}()]+)\)\<\/p\>/g, function(match, $1) {
			return music_str1 + $1 + music_str2
		});
	}
}


// ������������ͷ��
function hideNavAvatar() {
	$(document).ajaxComplete(function(event, xhr, option) {
		if ($("#topics").length > 0) {
			$('#header').addClass('header-hidden');
			$('#blogTitle').addClass('hidden');
			$('.toNav').addClass('hidden');
		}
	});
}
hideNavAvatar();

// ����css
function loadStyles(url) {
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = url;
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(link);
}

//�����ͷ 
function arrownDown() {
	str = "<a href='#navigator' class='toNav'></a>";
	$('#header').prepend(str);
}
arrownDown();


//�����ͷ 
function arrownTop() {
	var w = document.body.clientWidth;
	str = "<a href='#navigator' class='upToNav'></a>";
	if (w > 361) {
		$('#footer').prepend(str);
	} else if ($('#sidebar_scroller') == null) {
		$('#page_end_html').prepend(str);
	}
}
arrownTop();


// �ָ���������

window.alert = function() {};
var f = document.createElement("iframe");
f.style.cssText = "border:0;width:0;height:0;display:none";
document.body.appendChild(f);
var d = f.contentWindow.document;
d.write("<script type=\"text/javascript\">window.parent.alert = alert;<\/script>");
d.close();


// ��⵱ǰʱ���Ƿ������

function time_range(beginTime, endTime) {
	var strb = beginTime.split(":");
	if (strb.length != 2) {
		return false;
	}

	var stre = endTime.split(":");
	if (stre.length != 2) {
		return false;
	}

	var b = new Date();
	var e = new Date();
	var n = new Date();

	b.setHours(strb[0]);
	b.setMinutes(strb[1]);
	e.setHours(stre[0]);
	e.setMinutes(stre[1]);

	if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
		return true;
	} else {
		return false;
	}
}

function ninghtTip() {
	setTimeout(function() {
		if (getCookie("clostip") == "") {
			setCookie('clostip', 0, 30);
			if ((~time_range("7:30", "18:30")) && ($('html').css('color') == 'rgb(20, 20, 24)') && getCookie("clostip") == 0) {
				var truthBeTold = window.confirm("�Ѿ���������,�Ƿ��ҹ��ģʽ?");
				if (truthBeTold) {
					changeTheme();
				} else {
					var truthBeTold1 = window.confirm("���������Ҵ�ҹ��ģʽ?");
					if (truthBeTold1) {
						setCookie('clostip', 1, 30);
					} else {
						setCookie('clostip', 0, 30);
					}
				}
			}
		} else {
			if ((!time_range("7:30", "18:30")) && ($('html').css('color') == 'rgb(20, 20, 24)') && getCookie("clostip") == 0) {
				var truthBeTold = window.confirm("�Ѿ���������,�Ƿ��ҹ��ģʽ?");
				if (truthBeTold) {
					changeTheme();
				} else {
					var truthBeTold1 = window.confirm("���������Ҵ�ҹ��ģʽ?");
					if (truthBeTold1) {
						setCookie('clostip', 1, 30);
					} else {
						setCookie('clostip', 0, 30);
					}
				}
			}
		}
	}, 3000);

}

// ����
function loadNewsinfo(news) {
	str = '<div class="infocard normal"><p> <i class="fa fa-volume-up fa-2x" aria-hidden="true"></i>' + news +
		' </p></div>'
	$('#mainContent').prepend(str);
}

// owo������
function owoEmoji() {
	$("#tbCommentBody").after(
		'<div class="OwO" onclick="load_face(this)"><div class="OwO-logo"><span>O��O<space><space>����</span></div></div>');
}

function load_face(b) {
	var c = new OwO({
		logo: "O��O����",
		container: document.getElementsByClassName("OwO")[0],
		target: document.getElementById("tbCommentBody"),
		api: "https://gitee.com/j-x/home/raw/149974595b0fad9eae02cf47c774fb97b308d046/cnblogs/gshang.owo.json",
		position: "down",
		width: "70%",
		maxHeight: "250px"
	});
	b.classList.add("OwO-open");
	b.onclick = null
}










/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
	'use strict';

	// SCROLLSPY CLASS DEFINITION
	// ==========================

	function ScrollSpy(element, options) {
		this.$body = $(document.body)
		this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
		this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
		this.selector = (this.options.target || '') + ' .nav li > a'
		this.offsets = []
		this.targets = []
		this.activeTarget = null
		this.scrollHeight = 0

		this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
		this.refresh()
		this.process()
	}

	ScrollSpy.VERSION = '3.3.5'

	ScrollSpy.DEFAULTS = {
		offset: 10
	}

	ScrollSpy.prototype.getScrollHeight = function() {
		return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
	}

	ScrollSpy.prototype.refresh = function() {
		var that = this
		var offsetMethod = 'offset'
		var offsetBase = 0

		this.offsets = []
		this.targets = []
		this.scrollHeight = this.getScrollHeight()

		if (!$.isWindow(this.$scrollElement[0])) {
			offsetMethod = 'position'
			offsetBase = this.$scrollElement.scrollTop()
		}

		this.$body
			.find(this.selector)
			.map(function() {
				var $el = $(this)
				var href = $el.data('target') || $el.attr('href')
				var $href = /^#./.test(href) && $(href)

				return ($href &&
					$href.length &&
					$href.is(':visible') && [
						[$href[offsetMethod]().top + offsetBase, href]
					]) || null
			})
			.sort(function(a, b) {
				return a[0] - b[0]
			})
			.each(function() {
				that.offsets.push(this[0])
				that.targets.push(this[1])
			})
	}

	ScrollSpy.prototype.process = function() {
		var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
		var scrollHeight = this.getScrollHeight()
		var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
		var offsets = this.offsets
		var targets = this.targets
		var activeTarget = this.activeTarget
		var i

		if (this.scrollHeight != scrollHeight) {
			this.refresh()
		}

		if (scrollTop >= maxScroll) {
			return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
		}

		if (activeTarget && scrollTop < offsets[0]) {
			this.activeTarget = null
			return this.clear()
		}

		for (i = offsets.length; i--;) {
			activeTarget != targets[i] &&
				scrollTop >= offsets[i] &&
				(offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) &&
				this.activate(targets[i])
		}
	}

	ScrollSpy.prototype.activate = function(target) {
		this.activeTarget = target

		this.clear()

		var selector = this.selector +
			'[data-target="' + target + '"],' +
			this.selector + '[href="' + target + '"]'

		var active = $(selector)
			.parents('li')
			.addClass('active')

		if (active.parent('.dropdown-menu').length) {
			active = active
				.closest('li.dropdown')
				.addClass('active')
		}

		active.trigger('activate.bs.scrollspy')
	}

	ScrollSpy.prototype.clear = function() {
		$(this.selector)
			.parentsUntil(this.options.target, '.active')
			.removeClass('active')
	}


	// SCROLLSPY PLUGIN DEFINITION
	// ===========================

	function Plugin(option) {
		return this.each(function() {
			var $this = $(this)
			var data = $this.data('bs.scrollspy')
			var options = typeof option == 'object' && option

			if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
			if (typeof option == 'string') data[option]()
		})
	}

	var old = $.fn.scrollspy

	$.fn.scrollspy = Plugin
	$.fn.scrollspy.Constructor = ScrollSpy


	// SCROLLSPY NO CONFLICT
	// =====================

	$.fn.scrollspy.noConflict = function() {
		$.fn.scrollspy = old
		return this
	}


	// SCROLLSPY DATA-API
	// ==================

	$(window).on('load.bs.scrollspy.data-api', function() {
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this)
			Plugin.call($spy, $spy.data())
		})
	})

}(jQuery);