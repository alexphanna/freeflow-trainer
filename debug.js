

function drawLine(gl, x0, y0, x1, y1, r, g, b) {
  var vertices = new Float32Array([
    x0, y0, r, g, b,  
    x1, y1, r, g, b
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

function drawSquare(gl, x0, y0, x1, y1) {
  var vertices = new Float32Array([
    x0, y0, 0, 1, 0,  
    x1, y0, 0, 1, 0,  
    x1, y1, 0, 1, 0,  
    x0, y1, 0, 1, 0
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

  gl.drawArrays(gl.LINE_LOOP, 0, n);
}