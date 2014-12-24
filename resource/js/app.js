var _GLOBAL = {
	"api" : "http://cloud2.yfway.com/rss/api.php"
};
angular.module('app', ['ionic', "myControllers", "myServices", "myFilters"]).config(function($httpProvider) {
	$httpProvider.defaults.transformRequest = function(obj) {
		var str = [];
		for (var p in obj) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
		return str.join("&");
	}
	$httpProvider.defaults.headers.post = {
		'Content-Type' : 'application/x-www-form-urlencoded'
	}
	// 全局loading
	$httpProvider.interceptors.push(function($rootScope) {
		return {
			request : function(config) {
				$rootScope.$broadcast('loading:show')
				return config
			},
			response : function(response) {
				$rootScope.$broadcast('loading:hide')
				return response
			}
		}
	})
}).run(function($rootScope, $ionicLoading) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
		template : '<span class="icon spin ion-loading-d"></span> 加载中...'
	});
  })

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  })
}).config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('tabs', {
		url : "/tab",
		abstract : true,
		templateUrl : "resource/views/menu.html",
		controller : 'AppCtrl'
	}).state('tabs.index', {
		url : "/index",
		views : {
			'menuContent' : {
				templateUrl : "resource/views/index.html",
				controller : 'IndexCtrl'
			}
		}
	}).state('tabs.add', {
		url : "/add",
		views : {
			'menuContent' : {
				templateUrl : "resource/views/add.html",
				controller : 'NewsAddCtrl'
			}
		}
	}).state('tabs.news', {
		url : "/news/:name/:url",
		views : {
			'menuContent' : {
				templateUrl : "resource/views/news.html",
				controller : 'NewsCtrl'
			}
		}
	}).state('tabs.setting', {
		url : "/setting",
		views : {
			'menuContent' : {
				templateUrl : "resource/views/setting.html",
				controller : 'SettingCtrl'
			}
		}
	}).state('tabs.local', {
		url : "/local",
		views : {
			'menuContent' : {
				templateUrl : "resource/views/local.html",
				controller : 'LocalCtrl'
			}
		}
	})
	$urlRouterProvider.otherwise('/tab/index');
});

