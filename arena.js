class Arena extends Circle {
    constructor() {
        super(0, 0, 1, 140 / 255, 232 / 255, 1);
    }
    draw(gl) {
        super.draw(gl);

        const r = 140 / 255 / 1.5;
        const g = 232 / 255 / 1.5;
        const b = 1 / 1.5;

        drawLine(gl, 0, -1, 0, 1, r, g, b);
        drawLine(gl, -1, 0, 1, 0, r, g, b);

        drawLine(gl, Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4), -Math.cos(Math.PI / 4), r, g, b);
        drawLine(gl, Math.sin(Math.PI / 4), -Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), r, g, b);

        var circle = new Circle(0, 0, 2 / 3, r, g, b)
        circle.draw(gl);

        circle = new Circle(0, 0, 1 / 3, r, g, b)
        circle.draw(gl);
    }
}