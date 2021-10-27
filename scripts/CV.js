function handleDescrip(element){
  var title = element;
  var descrip = element.nextElementSibling;

  var visible = descrip.style.display;

  if(visible == "none"){
    descrip.style.display = "inline-block";
    descrip.style.fontWeight = "120";
    title.style.fontWeight = "300";
  }
  else{
    descrip.style.display = "none";
    title.style.fontWeight = "120";
  }
}

function addLink(){
  document.body.style.cursor = 'pointer';
}

function removeLink(){
  document.body.style.cursor = 'auto';
}
