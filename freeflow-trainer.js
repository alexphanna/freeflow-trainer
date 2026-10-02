// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // https://stackoverflow.com/a/4037426
  /*canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight*/

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(1, 1, 1, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var enemies = [];
  for (var i = 0; i < 4; i++) {
    var angle = Math.PI * 2 * Math.random();
    enemies.push(new Enemy(Math.sin(angle), Math.cos(angle)));
  }

  var player = new Player(0, 0)
    
  window.addEventListener("gamepadconnected", (e) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length,
    );
    const gp = navigator.getGamepads()[e.gamepad.index];
    
    // Start drawing
    var tick = function() {
      // Draw static shapes
      var arena = new Circle(0, 0, 1)
      arena.draw(gl);

      player.draw(gl);
      player.moveTowards(gp.axes[0], -gp.axes[1])

      enemies.forEach(enemy => {
        enemy.draw(gl)
        enemy.moveTowardsEntity(player)
        drawLine(gl, enemy.x, enemy.y, player.x, player.y)
      })
      requestAnimationFrame(tick, canvas); // Request that the browser calls tick*/
    };
    tick();
  });
}

function drawLine(gl, x0, y0, x1, y1) {
  var vertices = new Float32Array([
    x0, y0, 0, 1, 0,  
    x1, y1, 0, 1, 0
  ]);
  var n = 2; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const FSIZE = Float32Array.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var a_FragColor = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_FragColor < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
  }
  
  gl.vertexAttribPointer(a_FragColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_FragColor);

  gl.drawArrays(gl.LINES, 0, n);
}