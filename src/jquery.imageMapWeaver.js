/*!
 * ImageMap Weaver jQuery Plugin v1.0
 * http://lab.zzune.com
 * https://github.com/rioald/ImageMapWeaver
 *
 * Copyright (c) 2012 zune-seok Moon (zune rioald).
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Thu Oct 28 13:09:10 2012 +0900
 */

(function($) {

var ImageMapWeaver = function(targetMap) {
	"use strict";
	
	targetMap = $(targetMap).get(0);
	
	var targetImg = null;
	if(targetMap.name) {
		targetImg = $("img[usemap='#" + targetMap.name + "']");
	} else if(targetMap.id) {
		targetImg = $("img[usemap='#" + targetMap.id + "']");
	}
	
	var targetArea = $(targetMap).find("area");
 	var currentRatio = {
		width: 100,
 		height: 100
 	};
 	
 	var self = this;
 	
 	var _init = function() {
		// keep original coords 		
 		targetArea.each(function(i, v) {
 			$(v).data("coords", v.getAttribute("coords"));
 		});
 		
 		// bind window.onresize
 		if(navigator.userAgent.search("iPhone|iPod|iPad") > -1) {
 			$(window).bind("orientationchange", _onresize);
 		} else {
 			$(window).bind("resize", _onresize);
 		} 	 		
 	};
 	
 	var _isImgLoaded = function() {
 		if(targetImg.prop("naturalWidth")) {
 			return true;
 		}
 		
 		return false;
 	};
 	
 	var _calcRatio = function() {
 		currentRatio.width = targetImg.width() / targetImg.prop("naturalWidth");
 		currentRatio.height = targetImg.height() / targetImg.prop("naturalHeight");
 	};
 	
 	var _calcCoords = function(area, halfScale) {			
 		var area = $(area);
 		var coordsArray = area.data("coords").split(",");
		
		var calcLogic = function(dimension) {
			if(halfScale) {
				return coordsArray[i] - (coordsArray[i] - Math.round(coordsArray[i] * dimension / 2));
			} else {
				return coordsArray[i] - (coordsArray[i] - Math.round(coordsArray[i] * dimension));
			}
		}

		var isCoordsValid = true;
 		for(var i = 0; i < coordsArray.length; i++) {
 			if(i % 2 == 0) {
 				coordsArray[i] = calcLogic(currentRatio.width);
				
				if((coordsArray[i] > targetImg.width()) && !halfScale) {
					isCoordsValid = false;
					break;
				}
 			} else {
 				coordsArray[i] = calcLogic(currentRatio.width);

				if((coordsArray[i] > targetImg.height()) && !halfScale) {
					isCoordsValid = false;
					break;
				}
 			}
 		}
			
		if(!isCoordsValid) {
			return _calcCoords(area, true);
		}
 		
 		return coordsArray.join();
 	};

	var _onresize = function() {
		if(self.currentWindowSize != $(window).width()) {
			self.currentWindowSize = $(window).width();
			self.apply();
		}
	};
 	
 	this.apply = function() {
 		if(!_isImgLoaded()) {
 			targetImg.one("load", self.apply);
 			
 			return false;
 		};
 		
 		_calcRatio();
 		
 		targetArea.each(function(i, v) {
 			$(v).attr("coords", _calcCoords(v));
 		});
 	};
 	
 	_init();
};

$.fn.imageMapWeaver = function() {
	if(this.length <= 0) {
		return null;
	}

	var maps = [];

	this.each(function(i, v) {
		v.imageMapWeaver = new ImageMapWeaver(v);
		v.imageMapWeaver.apply();

		maps.push(v.imageMapWeaver);
	});
	
	return this.imageMapWeaver = maps;
};

})(jQuery);
