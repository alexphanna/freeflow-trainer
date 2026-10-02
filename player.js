class Player extends Entity {
    constructor(x, y) {
        super(-1, x, y, .09, 0, 0, 0, .0001)
        this.lastAttack = 0;
    }
    draw(gl, enemies) {
        super.draw(gl);2

        var closestEnemy = this.getClosestEntity(enemies);

        if (closestEnemy != null) {
            var highlight = new Circle(closestEnemy.x, closestEnemy.y, .11, 0, 0, 1)
            highlight.draw(gl);
        }
    }
    // Hits nearest enemy
    attack(enemy) {
        this.lastAttack = Date.now();
        
        // Increment combo meter
        var comboMeter = document.getElementById('combo-meter');
        comboMeter.textContent = Number.parseInt(comboMeter.textContent) + 1;

        // maybe abstract into moveTo method
        this.x = enemy.x;
        this.y = enemy.y;

        enemy.hit();
    }
    // Counters nearest uncountered enemy
    counters() {
        
    }
}