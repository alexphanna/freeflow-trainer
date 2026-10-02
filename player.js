class Player extends Entity {
    constructor(x, y) {
        super(-1, x, y, .09, 1, 1, 1, .0002)
        this.lastAttack = 0;
        this.aimX = 0;
        this.aimY = 0;
    }
    draw(gl, enemies) {
        super.draw(gl);

        var closestEnemy = this.getClosestEnemy(enemies);

        if (closestEnemy != null) {
            var highlight = new Circle(closestEnemy.x, closestEnemy.y, .06, .25, .5, .625)
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
    // Counter nearest uncountered enemy
    counter() {
        
    }
    aimTowardsEntity(entity) {
        this.aimTowards(entity.x, entity.y)
    }
    aimTowards(x, y) {
        // length of line should be 1
        const hypot = Math.hypot(x, y)
        this.aimX = (1 / hypot) * x;
        this.aimY = (1 / hypot) * y;
        console.log(this.aimX, this.aimY)
    }
    // first enemy close to aim line within FOV degrees around aim line
    getClosestEnemy(enemies) {
        // Aim direction (normalized)
        const aimDx = this.aimX - this.x;
        const aimDy = this.aimY - this.y;
        const aimLen = Math.hypot(aimDx, aimDy);
        if (aimLen === 0) return null;          // aiming at self, no direction

        const aimUx = aimDx / aimLen;
        const aimUy = aimDy / aimLen;

        const halfAngle = Math.PI / 8;          // 45° half-angle → 90° cone total
        const cosHalf   = Math.cos(halfAngle);

        let closestEnemy = null;
        let closestDistance = Number.MAX_VALUE;

        for (const enemy of enemies) {
            if (enemy.stunned()) continue;

            const ex = enemy.x - this.x;
            const ey = enemy.y - this.y;
            const dist = Math.hypot(ex, ey);
            if (dist === 0) continue;           // enemy on top of player

            // cos of angle between aim direction and enemy direction
            const dot = (ex * aimUx + ey * aimUy) / dist;

            if (dot < cosHalf) continue;        // outside the cone → skip

            if (dist < closestDistance) {
                closestEnemy = enemy;
                closestDistance = dist;
            }
        }
        return closestEnemy;
    }
}