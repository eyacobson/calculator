var mathButtons = document.querySelectorAll(".math");
var clearButton = document.getElementById("clear");
var delButton = document.getElementById("del");
var equalsButton = document.getElementById("equals");
var screen = document.getElementById("result");

var calcInput = "0";
var decimal = false;

for (var i = 0; i < mathButtons.length; i++) {
	mathButtons[i].addEventListener("click", function() {
		var symbols = ["+", "-", mathButtons[11].value, "/"];
		var posneg = ["+", "-"];

		//If first entry is number, overwrite 0
		if (calcInput === "0" && symbols.indexOf(this.value) === -1 && this.value !== ".") {
			calcInput = "" + this.value;
		//If first entry is operator, append to 0
		} else if (calcInput === "0" && symbols.indexOf(this.value) > -1) {
			calcInput = calcInput + this.value;
		//If entry is operator, and last entry was operator ...
		} else if (symbols.indexOf(this.value) > -1 && symbols.indexOf(calcInput[calcInput.length - 1]) > -1) {
			/*If entry is + or -, last entry was operator, and entry before that was a number, append + or - to input */
			if (posneg.indexOf(this.value) > -1 && !isNaN(calcInput.charAt(calcInput.length - 2))) {
				calcInput = calcInput + this.value;
			//Otherwise ... 
			} else {
				/*If last entry was any operator & entry before that
				was any operator, prohibit entry of a 3rd operator unless it's + or -!*/
				if (symbols.indexOf(calcInput[calcInput.length - 2]) > -1 && posneg.indexOf(this.value) === -1) {
					event.preventDefault();
				} else {
					calcInput = calcInput.slice(0, calcInput.length -1) + this.value;
				}
			}
		//Forbid multiple decimal points
		} else if (this.value === ".") {
			if (decimal) {
				event.preventDefault();
			} else {
				calcInput = calcInput + this.value;
				decimal = true;    //Set flag to forbid more decimals
			}
		} else {
			calcInput = calcInput + this.value;
		}

		//Anytime operator is entered, reset ability to enter decimal
		if (symbols.indexOf(this.value) > -1) {
			decimal = false;
		}

		screen.value = calcInput;
		screen.scrollLeft = screen.scrollWidth; //Scroll to right
	});
}

clearButton.addEventListener("click", function() {
	calcInput = "0";
	screen.value = calcInput;
	decimal = false;    //Reset decimal flag
});

delButton.addEventListener("click", function() {
	calcInput = calcInput.slice(0, calcInput.length - 1);

	if (calcInput === "") {
		screen.value = "0";
	} else {
		screen.value = calcInput;
	}
});

equalsButton.addEventListener("click", function() {
	var value = screen.value;
	var indices = [];

	//Put space between consecutive + or - signs, so eval will work
	while (value.search(/([+-])\1{1,}/) !== -1) {
		var index = value.search(/([+-])\1{1,}/);
		value = value.slice(0, index + 1) + " " + value.slice(index + 1);
	}

	//Convert HTML &times; entity to * so eval will work
	while (value.indexOf(mathButtons[11].value) > -1) {
		value = value.replace(mathButtons[11].value, "*");
	}

	//If screen value contains a decimal ...
	if (value.indexOf(".") > -1) {
		//Set to limited precision (we'll do 8)
		calcInput = eval(value).toPrecision(8);

		//If there's more than one trailing zero, chop it
		while (calcInput.charAt(calcInput.length - 1) === "0" && calcInput.charAt(calcInput.length - 2) !== ".") {
			calcInput = calcInput.slice(0, calcInput.length - 1);
		}

		//If you end up with something like "3.0", change to "3"
		if (calcInput.charAt(calcInput.length - 1) === "0" && calcInput.charAt(calcInput.length - 2) === ".") {
			calcInput = calcInput.slice(0, calcInput.length - 2);
		}
	} else {
		calcInput = eval(value).toString();
	}

	screen.value = calcInput;
});

/*Make screen unfocusable ... would be bad if there were any other
  inputs to navigate to w/ Tab, as it would break that */
screen.addEventListener("focus", function() {
	this.blur();
});