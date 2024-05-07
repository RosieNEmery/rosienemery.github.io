window.addEventListener("load", setupWebGL, false);
let gl;
let bubble_program;
let magnifying_glass_program;

function setupWebGL(evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  if (!(gl = getRenderingContext())) return;

  bubble_program = initShaders(gl, "#vertex-shader-bubble", "#fragment-shader-bubble");
  initializeAttributes(gl, bubble_program, 0.5);

  magnifying_glass_program = initShaders(gl, "#vertex-shader-tex", "#fragment-shader-tex");
  initializeAttributes(gl, magnifying_glass_program, 1.0);

  loadTexture(gl, bubble_program,
  "https://raw.githubusercontent.com/RosieNEmery/rosienemery.github.io/master/Images/About.png");
  loadTexture(gl, magnifying_glass_program,
  "https://raw.githubusercontent.com/RosieNEmery/rosienemery.github.io/master/Images/About.png");
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  //mouse events
  window.addEventListener("mousemove", handleMouseMove, false);

  render(gl, bubble_program, );
}

function initializeAttributes(gl, program, quad_size) {

  var posLocation = gl.getAttribLocation(program, "a_pos");
  var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  let centre = [0,0];

  var vertices = [
    1 + centre[0], -1 + centre[1],
    1 + centre[0], 1 + centre[1],
    -1 + centre[0], -1 + centre[1],
    -1 + centre[0], 1 + centre[1]
  ];

  // Create a buffer to put three 2d clip space points in
  var posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(posLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

  // provide texture coordinates for the rectangle.
  var uvs = [
     1, 0,
     1, 1,
     0, 0,
     0, 1
  ];

  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

}

function initShaders(gl, vertex_name, frag_name) {

  let source = document.querySelector(vertex_name).innerHTML;
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, source);

  source = document.querySelector(frag_name).innerHTML;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, source);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkErrLog = gl.getProgramInfoLog(program);
    cleanup();
    return;
  }
  return program;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function loadTexture(gl, program, source) {

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = source;
    image.onload = function() {

      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      var resLocation = gl.getUniformLocation(program, "u_canvasRes");
      gl.uniform2f(resLocation, gl.canvas.width, gl.canvas.height);

      var imgResLoc = gl.getUniformLocation(program, "u_imageRes");
      gl.uniform2f(imgResLoc, image.width, image.height);

      //resizeCanvastoImage(image.width, image.height);

      render(gl, program);
    };

}

function resizeCanvastoImage(image_width, image_height){

  let canvas_width = gl.canvas.width;
  let canvas_height = gl.canvas.height;


  if(image_width > image_height){
    let image_ratio = image_height/image_width;
    gl.canvas.height = gl.canvas.width * image_ratio;
  } else {
    let image_ratio = image_width/image_height;
    gl.canvas.height = gl.canvas.width * image_ratio;
}

}

function render(gl, program) {

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //var texLocation = gl.getUniformLocation(program, "u_tex");
  //gl.activeTexture(gl.TEXTURE0);
  //gl.uniform1i(texLocation, 0);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.useProgram(magnifying_glass_program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function handleMouseMove(event) {
  const x = event.clientX;
  const y = event.clientY;

  //pixels left + pixels top
  let canvasX = gl.canvas.offsetLeft;
  let canvasY = gl.canvas.offsetTop;

  let elementX = gl.canvas.offsetWidth;
  let elementY = gl.canvas.offsetHeight;

  var mx = (x - canvasX) / elementX;
  var my = (y - canvasY) / elementY;

  var mouseLoc= gl.getUniformLocation(bubble_program, "u_mouse");
  //var mouseLoc02 = gl.getUniformLocation(magnifying_glass_program, "u_mouse");
  //image is flipped
  my = 1 - my;

  gl.uniform2f(mouseLoc, mx, my);
  render(gl, bubble_program);

  //gl.uniform2f(mouseLoc02, mx, my);
  //render(gl, magnifying_glass_program);


}

function getRenderingContext() {
  var canvas = document.querySelector("canvas");

  gl = canvas.getContext("webgl")
    || canvas.getContext("experimental-webgl");

  if (!gl) {
    var paragraph = document.querySelector("p");
    paragraph.innerHTML = "Failed to get WebGL context."
      + "Your browser or device may not support WebGL.";
    return null;
  }

  return gl;
}


function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}



/*window.addEventListener("load", setupWebGL, false);
let gl;

function setupWebGL(evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  if (!(gl = getRenderingContext())) return;

  const program = initShaders();
  initializeAttributes(program);
  const texture = loadTexture(gl, "https://raw.githubusercontent.com/RosieNEmery/rosienemery.github.io/master/Images/About.png");

  drawScene(program, texture);

  cleanup();
}

function initShaders() {

  let source = document.querySelector("#vertex-shader").innerHTML;
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, source);

  source = document.querySelector("#fragment-shader").innerHTML;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, source);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  //gl.detachShader(program, vertexShader);
  //gl.detachShader(program, fragmentShader);
  //gl.deleteShader(vertexShader);
  //gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkErrLog = gl.getProgramInfoLog(program);
    cleanup();
    return;
  }
  return program;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


let buffer;
function initializeAttributes(program) {
//vertices
  var vertices = [
    1, -1,
    1, 1,
    -1, -1,
    -1, 1
  ];

  var vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var coord = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coord);

//uvs
  var uvs = [
     1, 0,
     1, 1,
     0, 0,
     0, 1
  ];

  var uv_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

  var uv_coord = gl.getAttribLocation(program, "uv");
  gl.vertexAttribPointer(uv_coord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(uv_coord);

}

function loadTexture(gl, source) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = source;
  img.onload = function() {

    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img);
    if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

        console.log("image loaded");
        console.log(img);
  };

  return texture;

}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function drawScene(program, texture) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    //add texture
    var texLocation = gl.getUniformLocation(program, "u_tex");

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(texLocation, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}


function cleanup() {
  gl.useProgram(null);
  if (buffer) {
    gl.deleteBuffer(buffer);
  }
  if (program) {
    gl.deleteProgram(program);
  }
}

function getRenderingContext() {
  var canvas = document.querySelector("canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  var gl = canvas.getContext("webgl")
    || canvas.getContext("experimental-webgl");
  if (!gl) {
    var paragraph = document.querySelector("p");
    paragraph.innerHTML = "Failed to get WebGL context."
      + "Your browser or device may not support WebGL.";
    return null;
  }
  gl.viewport(0, 0,
    gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return gl;
}*/
