class Arena extends Circle {
    constructor() {
        super(0, 0, 1, 140 / 255, 232 / 255, 1);
    }
    draw(gl) {
        super.draw(gl);

        const r = 140 / 255;
        const g = 232 / 255;
        const b = 1;

        for (var i = 0; i < 16; i++) {
            drawLine(gl, Math.sin(Math.PI / 8 * i), Math.cos(Math.PI / 8 * i), -Math.sin(Math.PI / 8 * i), -Math.cos(Math.PI / 8 * i), r / 1.5, g / 1.5, b / 1.5);
        }

        var circle = new Circle(0, 0, 4 / 8, r / 2, g / 2, b / 2)
        circle.draw(gl);

        var circle = new Circle(0, 0, 6 / 8, r / 2, g / 2, b / 2)
        circle.draw(gl);

        circle = new Circle(0, 0, 1 / 4, 0, 0, 0, true)
        circle.draw(gl);

        circle = new Circle(0, 0, 1 / 4, r / 2, g / 2, b / 2)
        circle.draw(gl);
    }
}