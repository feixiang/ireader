'use strict';
angular.module('myFilters', []).filter('getCdata', function() {
	return function(item) {
		var ret = "";
		if (item.__cdata) {
			ret = item.__cdata;
		} else {
			ret = item;
		}
		return ret;
	};
});