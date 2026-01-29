function CheckAspectRatio(){
  var height = window.innerHeight;
  var width = window.innerWidth;

  var ratio = width/height;

  if(ratio < 0.5625){
    var desktop = document.getElementsByClassName('bg-video-desktop');
    desktop[0].style.display = 'none';

    var mobile = document.getElementsByClassName('bg-video-mobile');
    mobile[0].style.display = 'block';

  } else {
    var mobile = document.getElementsByClassName('bg-video-mobile');
    mobile[0].style.display = 'none';

    var desktop = document.getElementsByClassName('bg-video-desktop');
    desktop[0].style.display = 'block';
  }
}

function BlurBG(){
  var desktop = document.getElementsByClassName('bg-video-desktop');
  desktop[0].style.filter = 'blur(5px) opacity(0.5)';

  var mobile = document.getElementsByClassName('bg-video-mobile');
  mobile[0].style.filter = 'blur(5px) opacity(0.5)';
}

function ResetBG(){
  console.log("reset");
  var desktop = document.getElementsByClassName('bg-video-desktop');
  desktop[0].style.filter = 'blur(0px) opacity(1.0)';


  var mobile = document.getElementsByClassName('bg-video-mobile');
  mobile[0].style.filter = 'blur(0px) opacity(1.0)';
}
