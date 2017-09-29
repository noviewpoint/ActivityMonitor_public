(function() {
	"use strict";

	/**
	 * @ngdoc object
	 * @name activityMonitor
	 * @description Monitor app for database activity
	 */
	angular
		.module("activityMonitor", ["ui.router", "ngSanitize", "ui.select", "chart.js", "moment-picker"])
		.config(config, "config")
		.run(run, "run");

	config.$inject = ["$urlRouterProvider", "$stateProvider"];

	function config($urlRouterProvider, $stateProvider) {
		console.log("In function config");

		// For any unmatched url, redirect
		$urlRouterProvider
			.otherwise("/");


		$stateProvider
			.state("realtime", {
				url: "/",
				templateUrl: "partials/realtime.html",
				controller: "RealtimeController",
				controllerAs: "RealtimeCtrl",
				// cache: false
				resolve: {

				}
			})
			.state("offline", {
				url: "/offline",
				templateUrl: "partials/offline.html",
				controller: "OfflineController",
				controllerAs: "OfflineCtrl",
				// cache: false
				resolve: {

				}
			});
	}

	run.$inject = ["$location", "$rootScope"];

	function run($location, $rootScope) {
		console.log("In function run");

		// ob refreshu brskalnika (F5) se aplikacija vedno postavi na zacetek
		$location.path("/");

		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				//console.log("Application has switched from state", fromState, "to state", toState, "from parameters", fromParams, "to parameters", toParams);
				console.log("PREHOD STANJ:", fromState.name, "-->", toState.name);
		});
	}
})();
