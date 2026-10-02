class Entity extends Circle {
    constructor(id, x, y, radius, r, g, b, speed) {
        super(x, y, radius, r, g, b, true);
        this.id = id;
        this.speed = speed;
        this.lastMove = Date.now();
        this.lastHit = 0;
    }
    stunned() {
        return Date.now() - this.lastHit <= STUN_DURATION;
    }
    hit() {
        this.lastHit = Date.now();
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

        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
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