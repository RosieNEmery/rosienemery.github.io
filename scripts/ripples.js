window.addEventListener("load", setupWebGL, false);
let gl;
let program;

function setupWebGL(evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  if (!(gl = getRenderingContext())) return;

  let source = document.querySelector("#vertex-shader").innerHTML;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, source);
  gl.compileShader(vertexShader);

  source = document.querySelector("#fragment-shader").innerHTML;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, source);
  gl.compileShader(fragmentShader);

  program = gl.createProgram();
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

  initializeAttributes();

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  cleanup();
}

let buffer;
function initializeAttributes() {
//vertices
  var vertices = [
    0.5, -0.5,
    0.5, 0.5,
    -0.5, -0.5,
    -0.5, 0.5
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

//add texture
  const img = new Image();
  img.onload = function () {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);

    const texLoc = gl.getUniformLocation(program, "texture");
    gl.uniform1i(texLoc, 0);

    // draw over the entire viewport
};
img.src = "../Images/About.png";

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
}
