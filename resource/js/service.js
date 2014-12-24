/**
 * 方案模型类
 */
angular.module('myServices', ['LocalForageModule']).factory('$localstorage', ['$window',
	function($window) {
		return {
			set: function(key, value) {
				$window.localStorage[key] = value;
			},
			get: function(key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			setObject: function(key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function(key) {
				return JSON.parse($window.localStorage[key] || '{}');
			},
			setList: function(key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getList: function(key) {
				return JSON.parse($window.localStorage[key] || '[]');
			},
			clear: function() {
				$window.localStorage.clear();
			}
		}
	}
]).factory('Util', function($ionicLoading) {
	return {
		toast: function(message, time) {
			$ionicLoading.show({
				template: '<span class="icon spin ion-ios7-information-outline"></span> ' + message,
				noBackdrop: true,
				duration: time
			});
		}
	}
}).factory("Cache", function($q,$localForage) {
	return {
		clear: function() {
			var deferred = $q.defer();
			$localForage.clear().then(function() {
				deferred.resolve(1);
			});
			return deferred.promise;
		}
	}
}).factory('News', ['$http', '$q', '$localstorage', '$localForage',
	function($http, $q, $localstorage, $localForage) {
		var getLocal = function() {
			var cache_key = "news_channel";
			var cache = $localstorage.getList(cache_key)
			return cache;
		}
		return {
			getChannels: function() {
				var deferred = $q.defer();
				var url = "resource/data/channel.json";
				var local = getLocal();
				$http.get(url).success(function(data) {
					// 再拿localstorage的数据
					data = data.concat(local);
					deferred.resolve(data);
				}).error(function() {
					deferred.resolve(local);
				});
				return deferred.promise;
			},
			get: function(_url) {
				var x2js = new X2JS();
				var deferred = $q.defer();
				var param = {
					"url": _url
				}
				$http.post(_GLOBAL.api, param).success(function(r) {
					var ret = r.data;
					var _rss = x2js.xml_str2json(ret);
					var data = _rss.rss.channel.item;
					// 保存到本地
					$localstorage.setObject(_url, data);
					deferred.resolve(data);
				}).error(function() {
					// 取离线数据
					$localForage.getItem(_url).then(function(ret) {
						var data = JSON.parse(ret);
						deferred.resolve(data);
					});
				});
				return deferred.promise;
			},
			add: function(item) {
				var cache_key = "news_channel";
				var cache = $localstorage.getList(cache_key);
				cache.push(item);
				$localstorage.setList(cache_key, cache);
			},
			download: function(index, _url) {
				var x2js = new X2JS();
				var deferred = $q.defer();
				var param = {
					"url": _url
				}
				$http.post(_GLOBAL.api, param).success(function(r) {
					var _rss = x2js.xml_str2json(r.data);
					var data = _rss.rss.channel.item;
					$localForage.setItem(_url, JSON.stringify(data)).then(function(data) {
						var status = 1;
						deferred.resolve(index);
					});
				}).error(function() {
					deferred.resolve(-1);
				});
				return deferred.promise;
			}
		}
	}
]);