class Enemy extends Entity {
    constructor(id, x, y) {
        super(id, x, y, .025, .75, 0, 0, 100, .0001)
        this.aimX = x;
        this.aimY = y;
    }

    moveTowards(x, y) {
        this.aimX = x;
        this.aimY = y;

        super.moveTowards(x, y);
    }

    highlight(enemies) {
        enemies.forEach(enemy => {
            enemy.g = 0;
        });
        this.g = 0.25;
    }

    draw(gl) {
        // The un-rotated shape points straight down (-y), i.e. at angle -PI/2.
        // Rotate by (aimAngle + PI/2) so the tip points at the aim point.
        const aimAngle = Math.atan2(this.aimY - this.y, this.aimX - this.x);
        const angle = aimAngle + Math.PI / 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Local offsets from (this.x, this.y) — same size as before.
        const shape = [
            [ 0     , -0.025],
            [-0.025 , 0.025], 
            [ 0     , 0.0125], 
            [ 0.025 , 0.025] 
        ];

        const data = [];
        for (let i = 0; i < shape.length; i++) {
            const ox = shape[i][0];
            const oy = shape[i][1];

            // Rotate offset around the origin, then translate to this position
            const rx = ox * cos - oy * sin;
            const ry = ox * sin + oy * cos;

            data.push(this.x + rx, this.y + ry, this.r, this.g, this.b);
        }

        var vertices = new Float32Array(data);
        var n = 4; // The number of vertices

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

        gl.lineW

        gl.drawArrays(gl.LINE_LOOP, 0, n);
    }
}