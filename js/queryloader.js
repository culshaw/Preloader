var QueryLoader = {
	/*
	 * QueryLoader		Preload your site before displaying it!
	 * Author:			Gaya Kessler
	 * Date:			23-09-09
	 * URL:				http://www.gayadesign.com
	 * Version:			1.0
	 * 
	 * A simple jQuery powered preloader to load every image on the page and in the CSS
	 * before displaying the page to the user.
	 */
	
	overlay: "",
	loadBar: "",
	preloader: "",
	items: new Array(),
	doneStatus: 0,
	doneNow: 0,
	selectorPreload: "body",
	logoImg: false,
	logoCircle: false,
	fakeCircle: false,
	ieLoadFixTime: 2000,
	ieTimeout: "",
	init: true,
	sec: 0,
	raph: false,
		
	initialise: function() {
	
		$('#loading').height($(window).height());
		if (navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/) == "MSIE 6.0,6.0") {
			//break if IE6			
			return false;
		}
		
		// Until the internet comes back!
		//QueryLoader.doneLoad();
		//return false;
		
		if (QueryLoader.selectorPreload == "body") {
			QueryLoader.spawnLoader();
			QueryLoader.getImages(QueryLoader.selectorPreload);
			QueryLoader.createPreloading();
		} else {
			$(document).ready(function() {
				QueryLoader.spawnLoader();
				QueryLoader.getImages(QueryLoader.selectorPreload);
				QueryLoader.createPreloading();
			});
		}
		
		//help IE drown if it is trying to die :)
		QueryLoader.ieTimeout = setTimeout("QueryLoader.ieLoadFix()", QueryLoader.ieLoadFixTime);
	},
	
	ieLoadFix: function() {
		var ie = navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/);
		
		if(ie != undefined) {
			if (ie[0].match("MSIE")) {
				while ((100 / QueryLoader.doneStatus) * QueryLoader.doneNow < 100) {
					QueryLoader.imgCallback();
				}
			}
		}
	},
	
	imgCallback: function() {
		QueryLoader.doneNow ++;
		QueryLoader.updateVal(QueryLoader.doneNow, this.items.length, 105, this.sec, 2);
		QueryLoader.animateLoader();
	},
	
	getImages: function(selector) {
		var everything = $(selector).find("*:not(script)").each(function() {
			var url = "";
			
			if ($(this).css("background-image") != "none") {
				var url = $(this).css("background-image");
			} else if (typeof($(this).attr("src")) != "undefined" && this.tagName.toLowerCase() == "img") {
				var url = $(this).attr("src");
			}
			
			url = url.replace("url(\"", "");
			url = url.replace("url(", "");
			url = url.replace("\")", "");
			url = url.replace(")", "");
			
			if (url.length > 0) {
				QueryLoader.items.push(url);
			}
		});
	},
	
	updateVal: function(value, total, R, hand, id) {
	    if (QueryLoader.init) {
			if(value == total) {
				this.raph.clear();
				this.fakeCircle = this.raph.circle(110,110,105).attr({colour: '', "stroke-width": 10});
			} else {
		        hand.animate({arc: [value, total, R]}, 0, ">");
		    }
	    } else {
	        if (!value || value == total) {
	            value = total;
	            hand.animate({arc: [value, total, R]}, 750, "bounce", function () {
	                hand.attr({arc: [0, total, R]});
	            });
	        } else {
	            hand.animate({arc: [value, total, R]}, 750, "elastic");
	        }
	    }
	},
	
	drawMarks: function(R, total) {
	    var out = r.set();
	    for (var value = 0; value < total; value++) {
	        var alpha = 360 / total * value,
	            a = (90 - alpha) * Math.PI / 180,
	            x = xy + R * Math.cos(a),
	            y = xy - R * Math.sin(a);
	        out.push(r.circle(x, y, 2).attr(marksAttr));
	    }
	    return out;
	},
	
	createPreloading: function() {
		QueryLoader.preloader = $("<div></div>").appendTo(QueryLoader.selectorPreload);
		$(QueryLoader.preloader).css({
			height: 	"0px",
			width:		"0px",
			overflow:	"hidden"
		});
		
		// Instead of loading all my svg's in different places, gonna render them here before loading the images.
		
		var logoC = Raphael("innerCircle", 206,206);
		$('#innerCircle').css('z-index', '31');
		this.logoCircle = logoC.circle(103,103,103).attr({'stroke': 'rgb(125,208,163)', 'fill': 'url(wave.jpg)', "stroke-width": 0});
		//this.logoImg = logoC.image("wave.gif", 0, 0, 103, 103);
		this.raph = Raphael("loader", 220, 220),
		xy = 110,
	    R = 210,
	    init = true,
	    param = {stroke: "#000", "stroke-width": 10},

		// Custom Attribute
		this.raph.customAttributes.arc = function (value, total, R) {
		    var alpha = 360 / total * value,
		        a = (90 - alpha) * Math.PI / 180,
		        x = xy + R * Math.cos(a),
		        y = xy - R * Math.sin(a),
		        color = 'rgb(29,79,107)',
		        path;
		    if (total == value) {
				path = [["M", xy, xy - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
		    } else {
		        path = [["M", xy, xy - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
		    }
		    return {path: path, stroke: color};
		};
		
		this.raph.customAttributes.colour = function() {
			return {stroke: 'rgb(29,79,107)'};
		};
				
		var length = QueryLoader.items.length; 
		this.sec = this.raph.path().attr(param).attr({arc: [0, 60, R]});
		
		QueryLoader.updateVal(0, length, 105, this.sec, 2);
		
		QueryLoader.doneStatus = length;
		
		for (var i = 0; i < length; i++) {
			var imgLoad = $("<img></img>");
			$(imgLoad).attr("src", QueryLoader.items[i]);
			$(imgLoad).unbind("load");
			$(imgLoad).bind("load", function() {
				QueryLoader.imgCallback();
			});
			$(imgLoad).appendTo($(QueryLoader.preloader));
		}
	},

	spawnLoader: function() {
		if (QueryLoader.selectorPreload == "body") {
			var height = $(window).height();
			var width = $(window).width();
			var position = "fixed";
		} else {
			var height = $(QueryLoader.selectorPreload).outerHeight();
			var width = $(QueryLoader.selectorPreload).outerWidth();
			var position = "absolute";
		}
		var left = $(QueryLoader.selectorPreload).offset()['left'];
		var top = $(QueryLoader.selectorPreload).offset()['top'];
	},
	
	animateLoader: function() {
		var perc = (100 / QueryLoader.doneStatus) * QueryLoader.doneNow;
		var angle = (3.6 * perc);

		QueryLoader.updateVal(QueryLoader.doneNow, this.items.length, 105, this.sec, 2);
		if (perc > 99) {
			QueryLoader.doneLoad();
			//this.sec.stop().animate({transform: "s0.1 0.1 0 0"}, '1000', "elastic");
		} else {
		
		}
	},
	
	doneLoad: function() {
		//prevent IE from calling the fix
		clearTimeout(QueryLoader.ieTimeout);
		var qLoad = this;
		qLoad.sec.hide();
		//transform: "r359deg"
		//qLoad.logoImg.stop().animate({opacity: 0}, 600);
		qLoad.logoCircle.stop().animate({transform: "s0.6 0.6 103 103"}, '1000', "easeInOut");
		qLoad.fakeCircle.stop().animate({transform: "s0.6 0.6 110 110"}, '1000', "easeInOut", function() {
			qLoad.logoCircle.stop().animate({opacity: 0}, 700);
			qLoad.fakeCircle.stop().animate({opacity: 0}, 700, 'easeInOut', function() {
				// Callback from circle
			});
			
			$('#loading').css('min-height', 'auto').animate({top: ($(window).height()*-1) + 'px'}, '800', function() {
				$(this).remove();				
			});
		});
		
		$(QueryLoader.overlay).fadeOut(800);
		$(QueryLoader.preloader).remove();
		
	}
}