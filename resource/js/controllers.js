angular.module('myControllers', []).controller('AppCtrl', function($scope) {

}).controller('IndexCtrl', function($scope, $state, News, $window) {
	$scope.list = [];
	$scope.noData = false;
	News.getChannels().then(function(data) {
		if (data != null) {
			$scope.list = data;
		} else {
			$scope.noData = false;
		}
	});
	$scope.toUrl = function(item) {
		$state.go("tabs.news", {
			"name": item.name,
			"url": $window.encodeURIComponent(item.url)
		});
	}
}).controller('NewsCtrl', function($scope, News, $stateParams, $window, $ionicModal, $ionicSlideBoxDelegate) {
	// 获取新闻内容
	$scope.list = [];
	$scope.name = $stateParams.name;
	$scope.inurl = $window.decodeURIComponent($stateParams.url);
	$scope.height = document.body.scrollHeight - 43;
	$scope.noData = false;
	$scope.loadData = function() {
		News.get($scope.inurl).then(function(data) {
			if (data != null) {
				$scope.list = data;
			} else {
				$scope.noData = true;
			}
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	$scope.loadData();

	$scope.toUrl = function(iframeurl) {
		$state.go("tabs.iframe", {
			"iframeurl": $window.encodeURIComponent(iframeurl)
		});
	}
	$scope.show = function(index) {
		$ionicSlideBoxDelegate.slide(index);
		$scope.modal.show();
	}
	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
}).controller('NewsAddCtrl', function($scope, $state, News, Util) {
	$scope.item = {
		"name": "36氪",
		"url": "http://www.36kr.com/feed/",
		"logo": "http://d.36kr.com/assets/36kr.png",
		"desc": "36氪"
	};
	$scope.add = function() {
		News.add($scope.item);
		Util.toast("添加成功", 1000);
		$state.go("tabs.index");
	}
}).controller('SettingCtrl', function($scope, Cache, Util) {
	$scope.clear = function() {
		Cache.clear();
		Util.toast("清除成功", 1000);
	}
}).controller('LocalCtrl', function($scope, Cache, Util, News) {
	$scope.list = [];
	News.getChannels().then(function(data) {
		if (data != null) {
			$scope.list = data;
		} else {
			$scope.hasMoreData = false;
		}
	});
	$scope.selectGroup = function() {
		$scope.list.forEach(function(item) {
			item.check = !item.check;
		});
	}
	$scope.download = function() {
		var length = $scope.list.length;
		for (i = length - 1; i >= 0; i--) {
			var item = $scope.list[i];
			if (item.check == true) {
				$scope.list[i].loading = true;
				News.download(i, item.url).then(function(index) {
					if (index < 0) {
						Util.toast("下载失败，请检查网络状态", 2000);
					} else {
						$scope.list[index].finish = true;
						$scope.list[index].check = false;
						$scope.list[index].loading = false;
					}
				});
			}
		};
	}
});