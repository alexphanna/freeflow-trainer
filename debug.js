

function drawLine(gl, x0, y0, x1, y1, r, g, b) {
  var vertices = new Float32Array([
    x0, y0, r, g, b,  
    x1, y1, r, g, b
  ]);
  var n = 2; // The number of vertices

  bindBuffers(gl, vertices, 5);

  gl.drawArrays(gl.LINES, 0, n);
}