function enlarge(element, amount){
  var image = element;
  addSiblingBlur(image);

  let scale = image.style.transform;
  let scale_amount = "scale(" + amount + ")";

  if(scale == scale_amount)
    reduce(element);
  else{
    image.style.transform = scale_amount;
    image.style.zIndex = "1";
  }

}

function reduce(element){
  var image = element;
  removeSiblingBlur(image);

  image.style.transform = "scale(1)";
}

function addSiblingBlur(element){
    // for collecting siblings
    let siblings = [];
    // if no parent, return
    if(!element.parentNode) {
        return;
    }
    // first child of the parent node
    let sibling  = element.parentNode.firstChild;

    // collecting siblings
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== element) {
              sibling.classList.add("blurred-element");
              sibling.classList.add("overlay-gallery");
              sibling.style.zIndex = "0";
        }
        sibling = sibling.nextSibling;
    }
    return;
}

function removeSiblingBlur(element){
    // for collecting siblings
    let siblings = [];
    // if no parent, return no sibling
    if(!element.parentNode) {
        return;
    }
    // first child of the parent node
    let sibling  = element.parentNode.firstChild;

    // collecting siblings
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== element) {
            if(sibling.classList.contains("blurred-element")){
              sibling.classList.remove("blurred-element");
              sibling.classList.remove("overlay-gallery");
            }
        }
        sibling = sibling.nextSibling;
    }
    return;
}

function accord_enlarge(element){
    element.style.width = "62.5%";
    element.style.opacity = "100%";

    // first child of the parent node
    let sibling  = element.parentNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== element) {
              sibling.style.width = "7.5%";
              sibling.style.opacity = "75%";
        }
        sibling = sibling.nextSibling;
    }
}
