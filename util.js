// possibly rename function in the future to something more representative of what is happening here
function bindBuffers(gl, vertices, stride) {
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

    var u_UseTexture = gl.getUniformLocation(gl.program, 'u_UseTexture');
    gl.uniform1i(u_UseTexture, false);


    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * stride, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var a_FragColor = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_FragColor < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    
    gl.vertexAttribPointer(a_FragColor, stride - 2, gl.FLOAT, false, FSIZE * stride, FSIZE * 2);
    gl.enableVertexAttribArray(a_FragColor);
}

function vibrateGamepad(gamepad, duration) {
    if (gamepad && gamepad.vibrationActuator) {
        gamepad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: duration,
            weakMagnitude: 1.0,
            strongMagnitude: 1.0
        });
    }
}