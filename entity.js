class Entity extends Polygon {
    constructor(id, x, y, radius, r, g, b, sides, speed) {
        super(x, y, radius, r, g, b, 1.0, sides, false);
        this.id = id;
        this.speed = speed;
        this.lastMove = Date.now();
        this.lastHit = 0;
        this.aimX = 0;
        this.aimY = 0;
    }
    stunned() {
        return Date.now() - this.lastHit <= STUN_DURATION;
    }
    hit() {
        this.lastHit = Date.now();
    }
    aimTowardsEntity(entity) {
        this.aimTowards(entity.x, entity.y)
    }
    aimTowards(x, y) {
        this.aimX = x;
        this.aimY = y;
    }
    moveTowardsEntity(entity) {
        this.moveTowards(entity.x, entity.y)
    }
    moveTowards(x, y) {
        const now = Date.now();

        // If an entity is STUNNED, then they do not move, but this should still be recorded as their last move
        if (now - this.lastHit <= STUN_DURATION) {
            this.lastMove = now;
            return;
        }

        const elapsed = now - this.lastMove;
        this.lastMove = now;

        const dx = x - this.x;
        const dy = y - this.y;
        const dist = Math.hypot(dx, dy);
        const step = this.speed * elapsed;

        if (dist <= step) {
            this.x = x;
            this.y = y;
            return;
        }
        
        // Should probably implement out-of-bounds logic here

        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;

        this.aimTowards(x, y);
    }
    getClosestEntity(entities) {
        var closestEntity = null
        var closestDistance = Number.MAX_VALUE
        entities.forEach(entity => {
            if (entity.stunned()) return;
            const dx = entity.x - this.x;
            const dy = entity.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < closestDistance) {
                closestEntity = entity;
                closestDistance = dist;
            }
        });
        return closestEntity;
    }
}