/*angular.module('beamng.apps')
.directive('anzeigeDos', ['StreamsManager', '$interval', function (StreamsManager, $interval) {
  return {
    templateUrl: 'modules/apps/AnzeigeDos/app.html',
    replace: true,
    restrict: 'EA',
    scope: true,
	controller: ['$log', '$scope', 'bngApi', 'StreamsManager', function ($log, $scope, bngApi, StreamsManager) {
			var streamsList = ['energie'];
			StreamsManager.add(streamsList);
			var old_en = 0;
			$scope.$on('streamsUpdate', function (event, data) {
				$scope.$evalAsync(function () {
					if (data.energie.en) {
						$scope.width_rect = data.energie.en/4000*100;
						$scope.verbrauch = data.energie.en;
					}
				});
			});

			$scope.$on('$destroy', function () {
				StreamsManager.remove(streamsList);
			});
    }]
  };
}]);

*/
/*
 * Custom user interface elements for pure knob.
 */
function PureKnob() {
	
	this.createKnob = function(width, height) {
		var heightString = height.toString();
		var widthString = width.toString();
		var smaller = width < height ? width : height;
		var fontSize = 0.2 * smaller;
		var fontSizeString = fontSize.toString();
		var canvas = document.createElement('canvas');
		var div = document.createElement('div');
		div.style.display = 'inline-block';
		div.style.height = heightString + 'px';
		div.style.position = 'relative';
		div.style.textAlign = 'center';
		div.style.width = widthString + 'px';
		div.appendChild(canvas);
		var input = document.createElement('input');
		var inputMode = document.createAttribute('inputmode');
		inputMode.value = 'numeric';
		input.setAttributeNode(inputMode);
		
		/*
		 * The knob object.
		 */
		var knob = {
			'_canvas': canvas,
			'_div': div,
			'_height': height,
			'_input': input,
			'_listeners': [],
			'_mousebutton': false,
			'_previousVal': 0,
			'_timeout': null,
			'_timeoutDoubleTap': null,
			'_touchCount': 0,
			'_width': width,
			
			/*
			 * Notify listeners about value changes.
			 */
			'_notifyUpdate': function() {
				var properties = this._properties;
				var value = properties.val;
				var listeners = this._listeners;
				var numListeners = listeners.length;
				
				/*
				 * Call all listeners.
				 */
				for (var i = 0; i < numListeners; i++) {
					var listener = listeners[i];
					
					/*
					 * Call listener, if it exists.
					 */
					if (listener !== null)
						listener(this, value);
					
				}
				
			},
			
			/*
			 * Properties of this knob.
			 */
			'_properties': {
				'angleEnd': 2.0 * Math.PI,
				'angleOffset': -0.5 * Math.PI,
				'angleStart': 0,
				'colorBG': '#181818',
				'colorFG': '#ff8800',
				'needle': false,
				'readonly': false,
				'trackWidth': 0.4,
				'valMin': 0,
				'valMax': 100,
				'val': 0
			},
			
			/*
			 * Abort value change, restoring the previous value.
			 */
			'abort': function() {
				var previousValue = this._previousVal;
				var properties = this._properties;
				properties.val = previousValue;
				this.redraw();
			},
			
			/*
			 * Adds an event listener.
			 */
			'addListener': function(listener) {
				var listeners = this._listeners;
				listeners.push(listener);
			},
			
			/*
			 * Commit value, indicating that it is no longer temporary.
			 */
			'commit': function() {
				var properties = this._properties;
				var value = properties.val;
				this._previousVal = value;
				this.redraw();
				this._notifyUpdate();
			},
			
			/*
			 * Returns the value of a property of this knob.
			 */
			'getProperty': function(key) {
				var properties = this._properties;
				var value = properties[key];
				return value;
			},
			
			/*
			 * Returns the current value of the knob.
			 */
			'getValue': function() {
				var properties = this._properties;
				var value = properties.val;
				return value;
			},
			
			/*
			 * Return the DOM node representing this knob.
			 */
			'node': function() {
				var div = this._div;
				return div;
			},
			
			/*
			 * Redraw the knob on the canvas.
			 */
			'redraw': function() {
				this.resize();
				var properties = this._properties;
				var needle = properties.needle;
				var angleStart = properties.angleStart;
				var angleOffset = properties.angleOffset;
				var angleEnd = properties.angleEnd;
				var actualStart = angleStart + angleOffset;
				var actualEnd = angleEnd + angleOffset;
				var value = properties.val;
				var valueStr = value.toString();
				var valMin = properties.valMin;
				var valMax = properties.valMax;
				var relValue = (value - valMin) / (valMax - valMin);
				var relAngle = relValue * (angleEnd - angleStart);
				var angleVal = actualStart + relAngle;
				var colorTrack = properties.colorBG;
				var colorFilling = properties.colorFG;
				var trackWidth = properties.trackWidth;
				var height = this._height;
				var width = this._width;
				var smaller = width < height ? width : height;
				var centerX = 0.5 * width;
				var centerY = 0.5 * height;
				var radius = 0.4 * smaller;
				var lineWidth = Math.round(trackWidth * radius);
				var fontSize = 0.2 * smaller;
				var fontSizeString = fontSize.toString();
				var canvas = this._canvas;
				var ctx = canvas.getContext('2d');
				
				/*
				 * Clear the canvas.
				 */
				ctx.clearRect(0, 0, width, height);
				
				/*
				 * Draw the track.
				 */
				ctx.beginPath();
				ctx.arc(centerX, centerY, radius, actualStart, actualEnd);
				ctx.lineCap = 'butt';
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = colorTrack;
				ctx.stroke();
				
				/*
				 * Draw the filling.
				 */
				ctx.beginPath();
				
				/*
				 * Check if we're in needle mode.
				 */
				if (needle)
					ctx.arc(centerX, centerY, radius, angleVal - 0.1, angleVal + 0.1);
				else
					ctx.arc(centerX, centerY, radius, actualStart, angleVal);
				
				ctx.lineCap = 'butt';
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = colorFilling;
				ctx.stroke();

				/*
				 * Set the color of the input element.
				 */
				var elemInput = this._input;
				elemInput.style.color = colorFilling;
			},
			
			/*
			 * This is called as the canvas or the surrounding DIV is resized.
			 */
			'resize': function() {
				var canvas = this._canvas;
				canvas.style.height = '100%';
				canvas.style.width = '100%';
				canvas.height = this._height;
				canvas.width = this._width;
			},
			
			/*
			 * Sets the value of a property of this knob.
			 */
			'setProperty': function(key, value) {
				this._properties[key] = value;
				this.redraw();
			},
			
			/*
			 * Sets the value of this knob.
			 */
			'setValue': function(value) {
				this.setValueFloating(value);
				this.commit();
			},

			/*
			 * Sets floating (temporary) value of this knob.
			 */
			'setValueFloating': function(value) {
				var properties = this._properties;
				var valMin = properties.valMin;
				var valMax = properties.valMax;
				
				/*
				 * Clamp the actual value into the [valMin; valMax] range.
				 */
				if (value < valMin)
					value = valMin;
				else if (value > valMax)
					value = valMax;
				
				value = Math.round(value);
				this.setProperty('val', value);
			}
			
		};
		
		

		return knob;
	};
	
}

var pureknob = new PureKnob();



