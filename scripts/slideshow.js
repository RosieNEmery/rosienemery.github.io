var slideIndex = 0;
var start_timer;
var end_timer;
var password_entered;

var length = 2000;

//startSlide();

function startSlide(){
  var slides = document.getElementsByClassName("slideshow");
  var dots = document.getElementsByClassName("dot");

  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}

  for (var i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" dot-active", "");
  }

  slides[slideIndex-1].style.display = "block";
  slides[slideIndex-1].classList.remove('slide-fade-out');
  slides[slideIndex-1].classList.add('slide-fade-in');

  dots[slideIndex-1].className += " dot-active";

  start_timer=setTimeout(function(){
    endSlide(2000);
  },2000);
}

function endSlide(duration) {
  var slides = document.getElementsByClassName("slideshow");
  slides[slideIndex-1].classList.remove('slide-fade-in');
  slides[slideIndex-1].classList.add('slide-fade-out');

  clearTimeout(start_timer);

  end_timer=setTimeout(function(){
    startSlide();
  },duration);
}

function currentSlide(n) {
  clearTimeout(start_timer);
  clearTimeout(end_timer);
  slideIndex = n;
  startSlide();
}

function pauseSlides() {
  clearTimeout(start_timer);
  clearTimeout(end_timer);
  var slides = document.getElementsByClassName("slideshow");
  slides[slideIndex-1].classList.add('no-anim');
}

function resumeSlides() {
  var pswd_elements = document.getElementsByClassName("slideshow-password");
  if(pswd_elements.length != 0) {
    removePasswordBox(pswd_elements[0]);
  }
  var slides = document.getElementsByClassName("slideshow");
  slides[slideIndex-1].classList.remove('no-anim');

  endSlide(2000);
}



//For password protection
function checkEnter(event, link) {
  if (event.which == 13 || event.key == "Enter") {
    var password = document.getElementById("passInput").value;
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

function checkKey(event, link, element) {
  checkEnter(event, link);
  if (event.which == 27 || event.key == "Escape"){
    removePasswordBox(element.parentNode);
  }
}

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

function getAccessSlide(element, link, colour) {
  var slide_ele = element;

  if (sessionStorage.password_entered) {
    window.location.href = link;
  } else {
    //add DOM for password
    var pswd_elements = document.getElementsByClassName("slideshow-password");
    if(pswd_elements.length == 0) {
      var pswd_link = "`"+link+"`";
      var pswd_text = '<div class = "slideshow-password" style="color:'+colour+';">PASSWORD:';
      var pswd_box = '<input type="text" class = "password-box" style="border-color:'+colour+';" value=""id="passInput" onkeydown="checkKey(event,'+ pswd_link + ',this)"></div>';
      var pswd_HTML = pswd_text.concat(pswd_box);

      slide_ele.insertAdjacentHTML('beforeend', pswd_HTML);
    }
  }
}

function removePasswordBox(pswd_element){
  pswd_element.remove();
}
