function checkPassword() {
  if (typeof(Storage) !== "undefined") {
    if (sessionStorage.password_entered) {
      //if password entered delete DOM elements for entering password

      var pswd_elements = document.getElementsByClassName("slideshow-password");

      while( pswd_elements.length > 0) {
        pswd_elements[0].remove();
      }

      pswd_elements = document.getElementsByClassName("password");

      while( pswd_elements.length > 0) {
        pswd_elements[0].previousElementSibling.style.top = "50%";
        pswd_elements[0].remove();
      }

    }
  }
}

document.addEventListener("DOMContentLoaded", checkPassword());


//For password protection
function checkEnter(element, event, link) {
  if (event.which == 13 || event.key == "Enter") {
    var password = element.value;
    if(password == "showreel"){
      window.location.href = link;

      if (typeof(Storage) !== "undefined") {
        if (!sessionStorage.password_entered) {
          //store for session that password entered so don't need to enter again
          sessionStorage.password_entered = 1;
        }
      }
    }
  }
}

function getAccess(link) {
  if (typeof(Storage) !== "undefined") {
    if (sessionStorage.password_entered) {
      window.location.href = link;
    }
  }
}

function checkAccess(){
  if (typeof(Storage) !== "undefined" ||
  !sessionStorage.password_entered) {
    window.location.href = '../work.html';
  }
}
