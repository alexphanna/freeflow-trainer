class Enemy extends Entity {
  constructor(id, x, y) {
    // #d41a25: color from upgrade selection screen in arkham knight
    super(id, x, y, 0.025, 212 / 255, 26 / 255, 37 / 255, 100, 3 / 10000);
  }

  highlight(enemies) {
    enemies.forEach((enemy) => {
      enemy.r = 212 / 255;
      enemy.g = 26 / 255;
      enemy.b = 37 / 255;
    });
    // #fff27f
    this.r = 1;
    this.g = 242 / 255;
    this.b = 127 / 255;
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
      [0, -1],
      [-1, 1],
      [0, 0.5],
      [1, 1],
    ];

    const data = [];
    for (let i = 0; i < shape.length; i++) {
      const ox = shape[i][0] * this.radius;
      const oy = shape[i][1] * this.radius;

      // Rotate offset around the origin, then translate to this position
      const rx = ox * cos - oy * sin;
      const ry = ox * sin + oy * cos;

      data.push(this.x + rx, this.y + ry, this.r, this.g, this.b);
    }

    var vertices = new Float32Array(data);
    var n = 4; // The number of vertices

    bindBuffers(gl, vertices, 5);

    gl.drawArrays(gl.LINE_LOOP, 0, n);
  }
}
