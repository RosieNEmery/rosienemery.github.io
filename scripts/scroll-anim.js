function onLoad(){
  var y_offset = window.pageYOffset;
  var centre = window.innerHeight/3.0;

  var arrows = document.getElementsByClassName("arrow");

  var scroll = y_offset + centre;
  var scroll_string = scroll.toString() + "px";

  for(var i = 0; i<arrows.length; i++){
    arrows[i].style.marginTop = scroll_string;
  }
}

function checkScroll(){
  var y_offset = window.pageYOffset;
  var centre = window.innerHeight/3.0;

  var arrows = document.getElementsByClassName("arrow");
  var curr = getComputedStyle(arrows[0]).marginTop;

  var scroll = y_offset + centre;
  var scroll_string = scroll.toString() + "px";

  var curr_string = curr.toString();

  for(var i = 0; i<arrows.length; i++){
    arrows[i].animate([
      { marginTop: curr_string, easing:'ease-out'},
      { marginTop: scroll_string, easing: 'ease-in'}],
    250);

    arrows[i].style.marginTop = scroll_string;
  }
}

document.addEventListener("scroll", checkScroll);
document.addEventListener("DOMContentLoaded", onLoad);
