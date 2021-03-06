game.PlayerEntity = me.ObjectEntity.extend({

    /* -----

    constructor

    ------ */

    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y,settings);

		// set the default horizontal & vertical speed (accel vector)
        this.setMaxVelocity(3, 3);
        this.gravity = 0;
        this.alwaysUpdate = true;
        this.alertedEnd = false;
        // adjust the bounding box
        this.updateColRect(-68, 241, -50, 164);
        //this.dimension = 241
    
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    },

    /* -----

    update the player pos

    ------ */
    update: function() {
        this.vel.x = 0;
        this.vel.y = 0;

        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
			this.flipX(true);
			// update the entity velocity
			//this.vel.x -= this.accel.x * me.timer.tick;
            this.vel.x = -20;
        } 
        
            if (me.input.isKeyPressed('right')) {
            // unflip the sprite
			this.flipX(false);
			// update the entity velocity
			//this.vel.x += this.accel.x * me.timer.tick;
            this.vel.x = 20;
        } 
        
         if (me.input.isKeyPressed('up')) {
            this.vel.y = -20;
         }
        
        if (me.input.isKeyPressed('down')) {
            if (this.pos.y < 372) {
                //Stops the ship ^
                this.vel.y = 20;
            } else {
                this.vel.y = 0;
            }
        }
        
        if( this.pos.x>2058 && this.alertedEnd == false) {
            alert('Turn around!!!!!!!');
            this.alertedEnd = true;
        }
        
        console.log(this.pos.x);
        
        /*
        if (me.input.isKeyPressed('jump')) {
			// make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.vel.y = this.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.jumping = true;
                // play some audio 
                me.audio.play("jump");
			}

        }
        */
        // check & update player movement
        this.updateMovement();

        // check for collision
        var res = me.game.world.collide(this);

        if (res) {
            // if we collide with an enemy
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                // the health goes down by one when enemy touches player
                game.data.score=game.data.score-1500;
                if(game.data.score<=0) {
                    //when the life is lower than 0, the game restartss
                    me.state.change(me.state.GAMEOVER);
                }
                // let's flicker in case we touched an enemy
                this.renderable.flicker(14);
                me.game.viewport.shake(10, 500, me.game.viewport.AXIS.BOTH);
            
            }
        }
        
        //if(res) {
          //  if (
        
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        
       // if (this position .x > level x position) { this.pos.x<500
            //do something
        //turn around and touch the other side
       // }
		
		// else inform the engine we did not perform
		// any update (e.g. position, animation)
        return false;
    }

});


/*----------------
 a Coin entity
------------------------ */
game.CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "spinning_coin_gold";
        settings.spritewidth = 32;
        // call the parent constructor
        this.parent(x, y, settings);
    },

    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
        // do something when collected

        // play a "coin collected" sound
        me.audio.play("cling");
        this.collidable = false;
        me.game.world.removeChild(this);
        // give some score
        game.data.score += 250;        

        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
    }

});


/* --------------------------
an enemy Entity
------------------------ */
game.EnemyEntity = me.ObjectEntity.extend({
    
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "EnemyDud";
        settings.spritewidth = 15;

        // call the parent constructor
        this.parent(x, y, settings);
        this.gravity = 0;

        

        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite

        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;

        // walking & jumping speed
        this.setVelocity(1, 6);

        // set collision rectangle
        this.updateColRect(4, 15, 8, 15);

        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

    },

    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {

        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling) {
            this.renderable.flicker(10);
        }
    },
    
    // manage the enemy movement
    update: function() {
        // do nothing if not in viewport
        if (!this.inViewport) {
            return false;
        }
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
				
        } else {
            this.vel.x = 0;
        }
        
        // check and update movement
        this.updateMovement();
		
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});
                                              
game.PowerUpsEntity = me.ObjectEntity.extend({
        
        init:function(x, y, settings) {
            settings.image = "AishaS2"
            settings.sprite = 15; 
            this.parent(x, y, settings);
            this.gravity = 0; 
        },
        
        onCollision: function() {
        // do something when collected

        // play a "coin collected" sound
            me.audio.play("cling");
            this.collidable = false;
            me.game.world.removeChild(this);
            // give some score
            game.data.score =- 100;        
    
            // make sure it cannot be collected "again"
            this.collidable = false;
            // remove it
            me.game.remove(this);
        }
});



