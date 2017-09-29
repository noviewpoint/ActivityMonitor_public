(function() {
	"use strict";

	angular
		.module("activityMonitor")
		.controller("OfflineController", OfflineController);

	OfflineController.$inject = ["asynchronousCallsService"];

	/**
	 * @ngdoc controller
	 * @name activityMonitor.controller:OfflineController
	 * @description
	 * Controller, ki prikazuje offline podatke.
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/activityMonitor/#/offline
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice.
	 * @requires asynchronousCallsService
	 */
	function OfflineController(asynchronousCallsService) {
		console.log("In OfflineController");

		var vm = this;

		vm.selectedPersons = [];
		vm.people = [];

		vm.startTime = null;
		vm.endTime = null;

		var tempObj = {};

		vm.info = "Controller initialized";

		vm.keyboardData = [];
		vm.noldusFaceReaderData = [];
		vm.tobiiEyeTrackerData = [];
		vm.androidWearM360Data = [];

		// na zacetku controllerja dobi vse userje
	    asynchronousCallsService.getAllUsers()
	    	.then(function(response) {
	    		console.log("response:", response.data);

	    		// if not exist end here
	    		if (response.data === undefined) {
	    			console.log("No users found!");
	    			return;
	    		}

	    		// pretvori dobljeni json objekt v array uporabnih objektov v view modelu
	    		angular.forEach(response.data, function(x) {

	    			// to generate a number between 0 and 255
	    			var rgb = Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256);

	    			// vsak user ima svojo barvo
	    			x.color = "rgb(" + rgb + ")";

	    			this.push(x);
	    		}, vm.people);

	    	}, function(errResponse) {
	    		console.log("Error", errResponse);
	    	});

		vm.onSelected = function(x) {
			console.log("In function vm.onSelected");
			//console.log(x.$$hashKey);
			//console.log(x.color);

			document.getElementById(x.$$hashKey).parentElement.parentElement.style.backgroundColor = x.color;

			tempObj.username = x.username;

			check();
		};

		vm.onRemove = function(x) {
			console.log("In function vm.onRemove");

			// poskrbi da background colorji obstoječih selectanih objektov v DOMu ostanejo pravilni!
			for (var i = 0; i < vm.selectedPersons.length; i++) {
				var x = vm.selectedPersons[i];
				console.log(x);
				document.getElementById(x.$$hashKey).parentElement.parentElement.style.backgroundColor = x.color;
			}
		};

		vm.selectDate = function() {
			check();
		};

		function check() {

			console.log("In function check");

			if (tempObj.username != null && vm.startTime != null && vm.endTime != null) {

				// pretvorba v UNIX timestamp
				tempObj.startTime = new Date(vm.startTime).getTime();
				tempObj.endTime = new Date(vm.endTime).getTime();

				//vm.labels = [vm.startTime._i, "2", "3", "4", "5", "6", vm.endTime._i];

				asynchronousCallsService.getKeyboardData(tempObj)
					.then(function(response) {
						/*var x = JSON.stringify(response.data).length;
						var y = 0;

						for (var propertyName in response.data) {
							console.log(propertyName);
							y++;
						}

						vm.data = x + " b | " + (x / y).toFixed(2) + " b/s";*/

						//console.log("getKeyboardData response", response.data);
						var keyboardData = [];
						for (var propertyName in response.data) {
							keyboardData.push(response.data[propertyName]);
						}
						vm.keyboardData = keyboardData;
						console.log("OfflineCtrl.keyboardData", vm.keyboardData);

					    //vm.data[1] = [1, 12, 50, 68];
					    drawGraph(keyboardData);
					}, function (errResponse) {
						console.log("getKeyboardData errResponse", errResponse);
					});

				asynchronousCallsService.getNoldusFaceReaderData(tempObj)
					.then(function(response) {
						console.log("getNoldusFaceReaderData response", response.data);
						/*var noldusFaceReaderData = [];
						for (var propertyName in response.data) {
							noldusFaceReaderData.push(response.data[propertyName]);
						}
						vm.noldusFaceReaderData = noldusFaceReaderData;
						console.log("OfflineCtrl.noldusFaceReaderData", vm.noldusFaceReaderData);*/
						//drawGraph(response.data);
					}, function (errResponse) {
						console.log("getNoldusFaceReaderData errResponse", errResponse);
					});

				asynchronousCallsService.getTobiiEyeTracker(tempObj)
					.then(function(response) {
						//console.log("getTobiiEyeTracker response", response.data);
						var tobiiEyeTrackerData = [];
						for (var propertyName in response.data) {
							tobiiEyeTrackerData.push(response.data[propertyName]);
						}
						vm.tobiiEyeTrackerData = tobiiEyeTrackerData;
						console.log("OfflineCtrl.tobiiEyeTrackerData", vm.tobiiEyeTrackerData);
						//drawGraph(response.data);
					}, function (errResponse) {
						console.log("getTobiiEyeTracker errResponse", errResponse);
					});

				asynchronousCallsService.getAndroidWearM360Data(tempObj)
					.then(function(response) {
						//console.log("getAndroidWearM360 response", response.data);
						var androidWearM360Data = [];
						for (var propertyName in response.data) {
							androidWearM360Data.push(response.data[propertyName]);
						}
						vm.androidWearM360Data = androidWearM360Data;
						console.log("OfflineCtrl.androidWearM360Data", vm.androidWearM360Data);
						//drawGraph(response.data);
					}, function (errResponse) {
						console.log("getAndroidWearM360 errResponse", errResponse);
					});

					vm.info = "All queries performing or have ended";
			} else {
				console.log("Not enough input data to perform query");
			}

		}




		function drawGraph(x) {
			console.log("drawGraph", x);
			// create a dataSet with groups
			var names = ['keyboard', 'noldus', 'tobii', 'wear'];

			var groups = new vis.DataSet();

			groups.add({
			  id: 0,
			  content: names[0],
			  options: {drawPoints: false}
			});

			groups.add({
			  id: 1,
			  content: names[1],
			  options: {drawPoints: false}
			});

			groups.add({
			  id: 2,
			  content: names[2],
			  options: {drawPoints: false}
			});

			groups.add({
			  id: 3,
			  content: names[3],
			  options: {drawPoints: false}
			});

			var container = document.getElementById('visualization');

			var items = new Array(x.length);

			for (var i = 0; i < x.length; i++) {
				console.log("HA");
				items[i] = {};
				var time = moment(x[i].casovniZig).format("YYYY-MM-DD hh:mm:ss");
				items[i].x = time;
				items[i].y = x[i].pravilnost;
				items[i].group = 1;
			}

			console.log("items", items);

			/*
			var items = [
			{x: '2014-06-13', y: 30, group: 0},
			{x: '2014-06-14', y: 10, group: 0},
			{x: '2014-06-15', y: 15, group: 1},
			{x: '2014-06-16', y: 30, group: 1},
			{x: '2014-06-17', y: 10, group: 1},
			{x: '2014-06-18', y: 15, group: 1},
			{x: '2014-06-19', y: 52, group: 1},
			{x: '2014-06-20', y: 10, group: 1},
			{x: '2014-06-21', y: 20, group: 2},
			{x: '2014-06-22', y: 60, group: 2},
			{x: '2014-06-23', y: 10, group: 2},
			{x: '2014-06-24', y: 25, group: 2},
			{x: '2014-06-25', y: 30, group: 2},
			{x: '2014-06-26', y: 20, group: 3},
			{x: '2014-06-27', y: 60, group: 3},
			{x: '2014-06-28', y: 10, group: 3},
			{x: '2014-06-29', y: 25, group: 3},
			{x: '2014-06-30', y: 30, group: 3}
			];
			*/

			var dataset = new vis.DataSet(items);
			var options = {
			defaultGroup: 'ungrouped',
			legend: true,
			start: '2016-06-30',
			end: '2016-12-30'
			};

			var graph2d = new vis.Graph2d(container, dataset, groups, options);

		}



		/*
	    vm.labels = ["January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July"];
	    vm.data = [
	    	[65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90],
			[12, 13, 14],
			[14, 10, 5]
	    ];

	    vm.series = ["tipkovnica", "noldus", "tobii", "wear"];
	    vm.onClick = function(points, evt) {
			console.log(points, evt);
	    };

	    vm.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
	    vm.options = {
	      scales: {
	        yAxes: [
	          {
	            id: 'y-axis-1',
	            type: 'linear',
	            display: true,
	            position: 'left'
	          },
	          {
	            id: 'y-axis-2',
	            type: 'linear',
	            display: true,
	            position: 'right'
	          }
	        ]
	      }
	    };
	    */


	}

})();
