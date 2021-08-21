/*const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//const container = document.getElementById( 'canvas-container' );
const drawing_canvas = document.getElementById( 'drawing-surface' );

renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true, canvas: drawing_canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );


const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 1;

const animate = function () {

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
};

var render = function() {
  animate();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

render();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}*/


function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function init(){
  this.canvas = document.getElementById( 'drawing-surface' );

  gl = this.canvas.getContext("webgl");
    if (!gl) {
      return;
    }

  var vertexShaderSource = document.querySelector("#vertex-shader-3d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-3d").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  this.program = createProgram(gl, vertexShader, fragmentShader);

  var posAttribLocation = gl.getAttribLocation(this.program, "a_position");

  var resLocation = gl.getUniformLocation(program, "u_res");
  gl.uniform2f(resLocation, gl.canvas.width, gl.canvas.height);
  var transLocation = gl.getUniformLocation(program, "u_trans");
  gl.uniform2f(transLocation, [0 , 0]);

  var posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

  var pos = [
  0, 0,
  0, 0.5,
  0.7, 0,];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.DYNAMIC_DRAW);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(this.program);


  gl.enableVertexAttribArray(posAttribLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      posAttribLocation, size, type, normalize, stride, offset);

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
  window.addEventListener( "mousedown", click, true );
}

function click(event){
  console.log(event);

  gl = this.canvas.getContext("webgl");

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  console.log(this.canvas.getContext("webgl"));

  var transLocation = gl.getUniformLocation(this.program, "u_trans");
  var trans = [event.x, event.y];
  gl.uniform2fv(transLocation, trans);

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

init();
