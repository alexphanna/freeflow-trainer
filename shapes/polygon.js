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

        bindBuffers(gl, vertices, 5);

        gl.lineWidth(2);
        gl.drawArrays(this.filled ? gl.TRIANGLE_FAN : gl.LINE_LOOP, 0, n);
    }
}