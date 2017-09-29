(function() {
	"use strict";

	angular
		.module("activityMonitor")
		.service("asynchronousCallsService", asynchronousCallsService);

	asynchronousCallsService.$inject = ["$http"];

	/**
	 * @ngdoc service
	 * @name activityMonitor.service:asynchronousCallsService
	 * @description
	 * Service, ki nudi funkcije za izvajanje asinhronih GET/POST klicev.
	 * @requires $http
	 */

	function asynchronousCallsService($http) {
		console.log("In asynchronousCallsService");

		// vse tu so ASYNCANI REQUESTI, ki vrnejo promise
		// privzeto angularjs naredi headers: {"Content-Type": "application/json"}
		// GET caching in browser ---> tam kjer nam je to koristno

		return {
			getActiveUsers: getActiveUsers,
			getAllUsers: getAllUsers,
			getUserData: getUserData,
			getKeyboardData: getKeyboardData,
			getAndroidWearM360Data: getAndroidWearM360Data,
			getNoldusFaceReaderData: getNoldusFaceReaderData,
			getTobiiEyeTracker: getTobiiEyeTracker,
			getMultiluxAccel: getMultiluxAccel,
			getMultiluxGSR: getMultiluxGSR
		};

		function getActiveUsers() {
			return $http({method: "GET", url: "php/get_active_users.php"});
		}
		function getAllUsers(x) {
			return $http({method: "GET", url: "php/get_all_users.php/" + x});
		}
		function getUserData(x) {
			return $http({method: "GET", url: "php/get_user_data.php/" + x});
		}
		function getKeyboardData(x) {
			return $http({method: "POST", url: "php/get_keyboard_data.php", data: x});
		}
		function getAndroidWearM360Data(x) {
			return $http({method: "POST", url: "php/get_android_wear_M360_data.php", data: x});
		}
		function getNoldusFaceReaderData(x) {
			return $http({method: "POST", url: "php/get_noldus_face_reader_data.php", data: x});
		}
		function getTobiiEyeTracker(x) {
			return $http({method: "POST", url: "php/get_tobii_eye_tracker_data.php", data: x});
		}
		function getMultiluxAccel(x) {
			return $http({method: "POST", url: "php/get_multilux_accel_data.php", data: x});
		}
		function getMultiluxGSR(x) {
			return $http({method: "POST", url: "php/get_multilux_GSR_data.php", data: x});
		}
	}
})();
