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
    arrows[i].style.marginTop = scroll_string;
    arrows[i].animate([
      { marginTop: curr_string, easing:'ease-out'},
      { marginTop: scroll_string, easing: 'ease-in'}],
      250);

  }
}

function checkPostition(event){
  var mousePos = {x: event.pageX, y: event.pageY};
  var width = window.innerWidth;
  var height = window.innerHeight;

  var left_percent = (width/100.0) * 12.5;
  var right_percent = width - left_percent;

  var l_arrow = document.getElementById("left_arrow");
  var r_arrow = document.getElementById("right_arrow");

  var offset = document.getElementsByClassName("row");
  var clamp_y = offset[0].offsetHeight + (height * 0.15);
  var offset_y = offset[0].offsetHeight
  var offset_x = l_arrow.offsetWidth / 2.0;

  var page_offset = window.pageYOffset;


  if(mousePos.x < left_percent){
    if( page_offset > clamp_y || mousePos.y > clamp_y){
      var l_pos = 100 - ((width - (mousePos.x - offset_x))/width) * 100.0 + "%";
      l_arrow.style.left = l_pos;

      var l_height = mousePos.y - (offset_y + l_arrow.offsetHeight/2.0);
      l_arrow.style.marginTop = l_height + "px";

      l_arrow.children[0].style.cursor = 'none';
      document.body.style.cursor = 'none';
    }
  }
  else if(mousePos.x > right_percent){
    if( page_offset > clamp_y || mousePos.y > clamp_y){
      var r_pos = ((width - (mousePos.x + offset_x))/width) * 100.0 + "%";
      r_arrow.style.right = r_pos;

      var r_height = mousePos.y - (offset_y + r_arrow.offsetHeight/2.0);
      r_arrow.style.marginTop = r_height + "px";

      r_arrow.children[0].style.cursor = 'none';
      document.body.style.cursor = 'none';
    }
  }
  else {
    document.body.style.cursor = 'default';
    var curr = l_arrow.style.left;
    console.log(curr);

    l_arrow.animate([
      { left: curr, easing: 'ease-out' },
      { left: "5%", easing: 'ease-in' }],
      150).finished.then(() => { l_arrow.style.left = "5%";});

    //checkScroll();
  }
}

document.addEventListener("scroll", checkScroll);
//document.addEventListener("mousemove", checkPostition);
document.addEventListener("DOMContentLoaded", onLoad);
