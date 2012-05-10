var activeKnobs = {};

function setupKnob(knob, container) {

	var rect = container.getBoundingClientRect();
	knob.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
	knob.setDimensions(container.clientWidth, container.clientHeight);

	var knobAngleField = document.getElementById("knobAngle"),
		knobValueField = document.getElementById("knobValue");

	setInterval(function() {
		var values = knob.getValues();
		if(knobAngleField)
			knobAngleField.value = values.angle.toFixed(2);
		if(knobValueField)
			knobValueField.value = values.val.toFixed(2);
	}, 500);


	// Detect touch capable client
	if ('ontouchstart' in window) {

		container.addEventListener('touchstart', function(e) {
			var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;

			// Keep track of the knobs currently being touched to support multitouch.
			activeKnobs[e.targetTouches[0].identifier] = knob;

			knob.doTouchStart(e.targetTouches, timeStamp);

			e.preventDefault();
		}, false);

		document.addEventListener('touchmove', function(e) {
			var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;

			// Support multi-touch knobs by only passing the appropriate touch events.
			for(var i = 0, l = e.changedTouches.length; i < l; i++) {

				var k = activeKnobs[e.changedTouches[i].identifier];

				if(typeof k !== "undefined") {
					k.doTouchMove([e.changedTouches[i]], timeStamp, e.scale);
				}
			}

		}, false);

		document.addEventListener('touchend', function(e) {
			var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
			knob.doTouchEnd(timeStamp);
		}, false);

		document.addEventListener('touchcancel', function(e) {
			var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
			knob.doTouchEnd(timeStamp);
		}, false);

	} else {

		var mousedown = false;

		container.addEventListener('mousedown', function(e) {
			// Don't react if initial down happens on a form element
			// if (e.target.tagName.match(/input|textarea|select/i)) {
			// 	return;
			// }

			knob.doTouchStart([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;
		}, false);

		document.addEventListener('mousemove', function(e) {
			if (!mousedown) {
				return;
			}

			knob.doTouchMove([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;

			// Prevent selection on drag
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;
		}, false);

		document.addEventListener('mouseup', function(e) {
			if (!mousedown) {
				return;
			}

			knob.doTouchEnd(e.timeStamp);

			mousedown = false;
		}, false);

		// Handle scroll for webkit
		container.addEventListener('mousewheel', function(e) {
			knob.doMouseScroll(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
			// Prevent page scroll
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;
		}, false);

		// Handle scroll for gecko
		// container.addEventListener('MozMousePixelScroll', function(e) {
		container.addEventListener('DOMMouseScroll', function(e) {
			knob.doMouseScroll(-4*e.detail, e.timeStamp, e.pageX, e.pageY);
			// Prevent page scroll
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;
		}, false);

	}
}



// var checkboxes = document.querySelectorAll("#settings input[type=checkbox]");
// for (var i=0, l=checkboxes.length; i<l; i++) {
// 	checkboxes[i].addEventListener("change", function() {
// 		scroller.options[this.id] = this.checked;
// 	}, false);
// }
// document.querySelector("#settings #zoom").addEventListener("click", function() {
// 	scroller.zoomTo(parseFloat(document.getElementById("zoomLevel").value));
// }, false);


/*
// Test for background activity (slow down scrolling)
setInterval(function() {
	var arr = [];
	for (var i=0, l=Math.random()*600; i<l; i++) {
		arr.push.call(arr, document.querySelectorAll(".abc" + i));
	}
}, 50);
*/
