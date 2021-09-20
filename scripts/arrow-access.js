function allowAccess(){
  var item = document.getElementById('page');
  if(item.classList.contains("blurred-element"))
    item.classList.remove("blurred-element");

  var body = document.getElementsByClassName('no-scroll');
  if(body[0]) body[0].classList.remove('no-scroll');
  window.removeEventListener("touchmove");

  var pswd_box = document.getElementById('pswd_overlay');
  if(pswd_box) pswd_box.remove();
}

function preventDefault(e) {
  e.preventDefault();
}

var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function() {supportsPassive = true; }
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;

function onLoad(){
  window.addEventListener("touchmove", preventDefault, wheelOpt);
  if (typeof(Storage) !== "undefined") {
    if (sessionStorage.password_entered) {
      allowAccess();
      return;
    }
  }
  var item = document.getElementById('page');
  var pswd_html = '<div id = "pswd_overlay" class = "overlay-page"> <div class = "overlay-text password">PASSWORD: <input type="text" class = "small-password-box" value=""id="passInput" onkeydown="checkEnter(event)"> </div> </div>'
  item.insertAdjacentHTML('beforebegin', pswd_html);

}

//For password protection
function checkEnter(event) {
  if (event.which == 13 || event.key == "Enter") {
    var password = document.getElementById("passInput").value;
    if(password == "showreel"){
      allowAccess();

      if (typeof(Storage) !== "undefined") {
        if (!sessionStorage.password_entered) {
          //store for session that password entered so don't need to enter again
          sessionStorage.password_entered = 1;
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", onLoad);
