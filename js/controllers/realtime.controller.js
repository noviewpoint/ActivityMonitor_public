(function() {
	"use strict";

	angular
		.module("activityMonitor")
		.controller("RealtimeController", RealtimeController);

	RealtimeController.$inject = ["asynchronousCallsService", "$scope"];

	/**
	 * @ngdoc controller
	 * @name activityMonitor.controller:RealtimeController
	 * @description
	 * Controller, ki prikazuje realtime podatke.
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/activityMonitor/#/
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice.
	 * @requires asynchronousCallsService
	 */
	function RealtimeController(asynchronousCallsService, $scope) {
		console.log("In RealtimeController");
		var vm = this;

		vm.selectedPersons = [];
		vm.people = [];

		var chart = new SmoothieChart({millisPerPixel: 40, grid: {verticalSections: 10}, labels: {precision: 0}, minValue: 0, maxValueScale:1.3});

		vm.onSelected = function(x) {
			console.log("In function vm.onSelected");
			document.getElementById(x.$$hashKey).parentElement.parentElement.style.backgroundColor = x.color;
		};

		vm.onRemove = function(x) {
			console.log("In function vm.onRemove");
			for (var i = 0; i < vm.selectedPersons.length; i++) {
				var x = vm.selectedPersons[i];
				console.log(x);
				document.getElementById(x.$$hashKey).parentElement.parentElement.style.backgroundColor = x.color;
			}
		};

		asynchronousCallsService.getActiveUsers()
			.then(function(response) {
				console.log("response:", response.data);

				// if not exist end here
				if (response.data === undefined) {
					console.log("No users found!");
					return;
				}

				var primerjava = null;
				// pretvori dobljeni json objekt v array uporabnih objektov v view modelu
				angular.forEach(response.data, function(x) {

					if (primerjava === x.username) {
						//console.log("Delam nove lastnosti na obstoječem elementu arraya:", x.input_bytes_sensors_data_size);
						vm.people[vm.people.length - 1][x.name_sensors] = x.input_bytes_sensors_data_size;
					} else {
						//console.log("Ustvarjam nov element arraya za username:", x.username);
						primerjava = x.username;

						x[x.name_sensors] = x.input_bytes_sensors_data_size;
						delete x.name_sensors;
						delete x.input_bytes_sensors_data_size;

						// vsak user svoj time series
						x.TimeSeries = new TimeSeries();

						// to generate a number between 0 and 255
						var rgb = Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256);

						// vsak user ima svojo barvo
						x.color = "rgb(" + rgb + ")";

						// dodaj na chart vsak time series posebej s svojo unikatno barvo
						chart.addTimeSeries(x.TimeSeries, { strokeStyle: "rgba(" + rgb + ", 1)", fillStyle: "rgba(" + rgb + ", 0.2)", lineWidth: 4 });

						this.push(x);
					}
				}, vm.people);

				console.log(vm.people);

			}, function(errResponse) {
				console.log("Error", errResponse);
			});

		// random update grafa na 1000ms
		var timer1 = setInterval(function() {

			asynchronousCallsService.getActiveUsers()
				.then(function(response) {
					//console.log("response:", response.data);

					// if not exist end here
					if (response.data === undefined) {
						console.log("Nothing to draw!");
						return;
					}

					// je to cista kopija?
					var tempSelectedPersons = vm.selectedPersons;

					// navidezna matrika (ki ni v viewmodelu)
					var tempArray = [];

					var primerjava = null;
					// napolni navidezno matriko z uporabnimi objekti
					angular.forEach(response.data, function(x) {

						if (primerjava === x.username) {
							tempArray[tempArray.length - 1][x.name_sensors] = x.input_bytes_sensors_data_size;
						} else {
							primerjava = x.username;

							x[x.name_sensors] = x.input_bytes_sensors_data_size;
							delete x.name_sensors;
							delete x.input_bytes_sensors_data_size;

							this.push(x);
						}
					}, tempArray);

					//console.log(tempArray);

					// izvedi primerjavo
					for (var i = 0; i < tempArray.length; i++) {

						for (var j = 0; j < tempSelectedPersons.length; j++) {

							if (tempArray[i].username === tempSelectedPersons[j].username) {

								console.log("Something to draw!");

								var keyboard = parseFloat(tempArray[i].keyboard);
								var noldusFaceReader = parseFloat(tempArray[i].noldus_face_reader);
								var androidWear_M360 = parseFloat(tempArray[i].android_wear_M360);
								var arduino_MPU6050 = parseFloat(tempArray[i].arduino_MPU6050);
								var tobiiEyeTracker = parseFloat(tempArray[i].tobii_eye_tracker);
								var multiluxAccel = parseFloat(tempArray[i].multilux_accel);
								var multiluxGSR = parseFloat(tempArray[i].multilux_GSR);

								keyboard = keyboard || 0;
								noldusFaceReader = noldusFaceReader || 0;
								androidWear_M360 = androidWear_M360 || 0;
								arduino_MPU6050 = arduino_MPU6050 || 0;
								tobiiEyeTracker = tobiiEyeTracker || 0;
								multiluxAccel = multiluxAccel || 0;
								multiluxGSR = multiluxGSR || 0;

								var sum = keyboard + noldusFaceReader + androidWear_M360 + arduino_MPU6050 + tobiiEyeTracker + multiluxAccel + multiluxGSR;
								var newPoint = sum;

								// od 0 do 1
								tempSelectedPersons[j].TimeSeries.append(Date.now(), newPoint);
							}

						}
					}

				}, function(errResponse) {
					console.log("Error", errResponse);
				});

		}, 1000);

		function streamajNaGraf() {
			chart.streamTo(document.getElementById("chart"), 1000);
		}

		// pocakaj 100ms da se tekoce zrise vrednosti na graf
		var timer2 = setTimeout(streamajNaGraf, 100);

		// ob izhodu ubij timeoute
		$scope.$on("$destroy", function() {
			console.log("Destroyani scopi");
			clearTimeout(timer1);
			clearTimeout(timer2);
		});

	}

})();
