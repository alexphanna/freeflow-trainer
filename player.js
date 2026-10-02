class Player extends Entity {
    constructor(x, y) {
        super(x, y, 0, 0, 0, .005)
        this.lastAttack = 0;
    }
    getClosestEnemy(enemies) {
        var closestEnemy = null
        var closestDistance = Number.MAX_VALUE
        enemies.forEach(enemy => {
            if (enemy.stunned) return;
            // Maybe abstract this into distanceToEntity method
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < closestDistance) {
                closestEnemy = enemy;
                closestDistance = dist;
            }
        });
        return closestEnemy;
    }
    // Hits nearest enemy
    attack(enemies) {
        var enemy = this.getClosestEnemy(enemies);

        const now = Date.now();
        const elapsed = now - this.lastAttack;

        if (elapsed < ATTACK_COOLDOWN) {
            return;
        }

        if (enemy == null) {
            return;
        }

        this.lastAttack = now;

        // maybe abstract into moveTo method
        this.x = enemy.x;
        this.y = enemy.y;

        enemy.hit();
    }
    // Counters nearest uncountered enemy
    counters() {
        
    }
}