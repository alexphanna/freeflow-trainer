class Polygon {
    constructor(x, y, radius, r, g, b, sides, filled) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.radius = radius;
        this.sides = sides;
        this.filled = filled;
    }
    draw(gl) {
        var n = this.sides; // The number of vertices
        var vertices = new Float32Array(n * 5);
        for (var i = 0; i < n; i += 1) {
            vertices[i * 5 + 0] = Math.sin(Math.PI * 2 / n * i) * this.radius + this.x;
            vertices[i * 5 + 1] = Math.cos(Math.PI * 2 / n * i) * this.radius + this.y;
            vertices[i * 5 + 2] = this.r;
            vertices[i * 5 + 3] = this.g;
            vertices[i * 5 + 4] = this.b;
        }

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

        gl.lineWidth(5);
        gl.drawArrays(this.filled ? gl.TRIANGLE_FAN : gl.LINE_LOOP, 0, n);
    }
}