const display = document.getElementById("display");

function addDigit(n){
    display.value += n;
}

function clearScreen(){
    display.value = "";
}

function removeDigit(){
    display.value = display.value.toString().substr(0, display.value.length-1);
}

function calculate(){
    display.value = eval(display.value);
}