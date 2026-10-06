class Arena extends Circle {
    constructor() {
        // #727e83
        super(0, 0, 1, 114 / 255, 126 / 255, 131 / 255, 1);
    }
    draw(gl) {
        super.draw(gl);

        const r = 114 / 255; 
        const g = 126 / 255;
        const b = 131 / 255;

        for (var i = 0; i < 16; i++) {
            drawLine(gl, Math.sin(Math.PI / 8 * i), Math.cos(Math.PI / 8 * i), -Math.sin(Math.PI / 8 * i), -Math.cos(Math.PI / 8 * i), r / 1.5, g / 1.5, b / 1.5);
        }

        var circle = new Circle(0, 0, 1 / 4, 0, 0, 0, 1, true)
        circle.draw(gl);

        for (var i = 2; i < 8; i += 2) {
            circle = new Circle(0, 0, i / 8, r / 2, g / 2, b / 2, 1)
            circle.draw(gl);
        }
    }
}