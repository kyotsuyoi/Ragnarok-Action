class Enemy{
    constructor({id, type, x, y, patrol, follow, knock_back, lastTimestamp}){
        this.id = id
        this.type = type
        this.layer = y
        this.die = false
        this.position ={
            x : x,
            y : y
        }
        this.velocity={
            x : 0,
            y : 0
        }
        this.width = 50
        this.height = 50
        this.speed = 1.2
        this.frames = 0
        this.reverse_frame = false
        this.lastTimestamp = lastTimestamp

        this.frameTime = 0
        this.standFrameTime = 100
        this.walkingFrameTime = 100
        this.runningFrameTime = this.walkingFrameTime/2
        this.attack_frame_time = 250
        
        this.die_frame_time = 250

        this.recoveryTime = 100     
        this.lastRecoveryTime = lastTimestamp

        this.patrol_time_wait = 1000
        this.in_patrol_time = 0
        this.patrol_x = 0
        this.patrol_y = 0
        this.in_battle = false
        this.in_patrol = false
        this.patrol = patrol //enable or disable patrol
        this.follow = follow //enable or disable follow
        this.knock_back = knock_back //enable or disable follow

        this.power = 10
        this.agility = 1
        this.dexterity = 10
        this.vitality = 12
        this.inteligence = 1

        this.max_hp = hp_value(this.vitality, this.power)
        this.max_sp = sp_value(this.inteligence, this.dexterity)
        this.max_stamina = 100

        this.hp = this.max_hp
        this.sp = this.max_sp
        this.stamina = this.max_stamina
        
        this.attack = attack_value(this.power, this.dexterity)
        this.defense = defense_value(this.vitality, this.dexterity)
        this.flee = flee_value(this.agility, this.dexterity)
        
        this.speed = speed_value(this.agility)       
        this.attack_speed = attack_speed_value(this.agility)     
        this.hp_recovery = hp_recovery(this.vitality) 
        this.sp_recovery = sp_recovery(this.inteligence, this.dexterity)

        this.target_range = 400
        this.attack_range = 150
        this.stun_time = 0

        this.sprites = {
            stand : {                
                spriteSheet : createImage('./src/image/orc_warrior_stand.png'),
                cropX : 0,
                cropY : 0,
                cropWidth : 72,
                cropHeight : 105,
                width : 72,
                height : 105
            },
            walking : {
                spriteSheet : createImage('./src/image/orc_warrior_walking.png'),
                cropX : 0,
                cropY : 0,
                cropWidth : 86,
                cropHeight : 105,
                width : 86,
                height : 105
            },
            attack : { //16
                spriteSheet : createImage('./src/image/orc_warrior_attack.png'),
                cropX : 0,
                cropY : 0,
                cropWidth : 93,
                cropHeight : 116,
                width : 93,
                height : 116
            },
            die : { //20
                spriteSheet : createImage('./src/image/orc_warrior_die.png'),
                cropX : 0,
                cropY : 0,
                cropWidth : 106,
                cropHeight : 101,
                width : 106,
                height : 101
            }
        }
        this.currentPosition = this.sprites.stand  
        
        this.attack_area = {
            position : {
                x : 0,
                y : 0
            },
            width : this.attack_range, 
            height : this.attack_range
        }  

        this.hunt_area = {
            position : {
                x : 0,
                y : 0
            },
            width : this.target_range, 
            height : this.target_range
        } 

        this.attack_cooldown = 0        
        this.attack_frame_count = 0

        this.is_walking = false
        this.is_attack = false
        this.is_hunt = false
        this.side = 'down'
        this.hunt_side = false
        this.attack_side = false
        this.near_side = false
        this.attack_hit = false
        
        this.walk_sound = new Audio("./src/sound/ork_warrior_step1.wav")
    }

    draw(){
        var radius = 20
        context.beginPath()
        context.arc(this.position.x + this.width/2, this.position.y + (this.height/4)*2, radius, 0, 2 * Math.PI, false)
        context.fillStyle = '#00000055'
        context.fill()

        this.areaDebug(false)

        context.drawImage(          
            this.currentPosition.spriteSheet, 
            this.currentPosition.cropWidth * this.frames, //corte no eixo x
            this.currentPosition.cropY, //corte no eixo y
            this.currentPosition.cropWidth, //largura do corte
            this.currentPosition.cropHeight, //altura do corte
            (this.position.x + this.width/2) - (this.currentPosition.width/2), 
            (this.position.y + this.height - this.currentPosition.cropHeight),
            this.currentPosition.width,
            this.currentPosition.height
        ) 
        
        if(!this.die){
            this.showBar()
        }
    }

    update(){   
 
        if(lastTimestamp - this.frameTime > this.lastTimestamp){
            if(this.reverse_frame){
                this.frames-- 
            }else{
                this.frames++
            }            
            this.lastTimestamp = lastTimestamp
            if(this.is_attack){
                this.attack_frame_count++
            }
        } 
        
        if(this.die){            
            this.currentPosition = this.sprites.die 
            this.frameTime = this.die_frame_time
            this.reverse_frame = false
            switch(this.side){
                case 'down':
                    if(this.frames >= 4){
                        this.frames = 4
                    }
                    this.frameCheck(0, 4, false)
                break
    
                case 'left':
                    if(this.frames >= 9){
                        this.frames = 9
                    }
                    this.frameCheck(5, 9, false)
                break
    
                case 'up':
                    if(this.frames >= 14){
                        this.frames = 14
                    }
                    this.frameCheck(10, 14, false)
                break
    
                case 'right':
                    if(this.frames >= 19){
                        this.frames = 19
                    }
                    this.frameCheck(14, 19, false)
                break
            }
            return
        }           
        
        this.layer = this.position.y
        
        this.attack_area.position.x = this.position.x + this.width/2 - this.attack_range/2, 
        this.attack_area.position.y = this.position.y + this.height/2 - this.attack_range/2
        this.hunt_area.position.x = this.position.x + this.width/2 - this.target_range/2, 
        this.hunt_area.position.y = this.position.y + this.height/2 - this.target_range/2

        if(!this.is_walking && !this.in_battle && !this.is_attack){
            this.currentPosition = this.sprites.stand 
            this.frameTime = this.standFrameTime
            switch(this.side){
                case 'down':
                    this.frameCheck(0, 4, true)
                break
    
                case 'left':
                    this.frameCheck(5, 9, true)
                break
    
                case 'up':
                    this.frameCheck(10, 13, true)
                break
    
                case 'right':
                    this.frameCheck(14, 17, true)
                break
            }
        }    
        
        if(this.is_walking && !this.is_attack){
            this.currentPosition = this.sprites.walking 
            this.frameTime = this.walkingFrameTime
            this.reverse_frame = false
            switch(this.side){
                case 'down':
                    this.frameCheck(0, 5, false)
                break
    
                case 'left':
                    this.frameCheck(6, 11, false)
                break
    
                case 'up':
                    this.frameCheck(12, 17, false)
                break
    
                case 'right':
                    this.frameCheck(18, 23, false)
                break
            }
        }

        if(this.attack_frame_count > 3){
            this.is_attack = false
            this.attack_frame_count = 0
            this.currentPosition = this.sprites.stand
            this.attack_hit = false
            this.is_attack = false
        }

        if(this.attack_frame_count == 2 && !this.attack_hit){
            this.attack_side = this.side
            this.attackAction()
            this.attack_hit = true
        }  

         //attack
         if(this.is_attack){     
            this.reverse_frame = false       
            if(this.side === 'up'){
                this.currentPosition = this.sprites.attack 
                if(!(this.frames >= 12 && this.frames <= 15)){
                    this.frames = 12
                    this.frameTime = this.attack_frame_time
                }   
            } else if (this.side === 'left'){  
                this.currentPosition = this.sprites.attack 
                if(!(this.frames >= 4 && this.frames <= 7)){
                    this.frames = 4
                    this.frameTime = this.attack_frame_time
                } 
            } else if (this.side === 'down'){   
                this.currentPosition = this.sprites.attack 
                if(!(this.frames >= 0 && this.frames <= 3)){
                    this.frames = 0
                    this.frameTime = this.attack_frame_time
                }
            } else if (this.side === 'right'){    
                this.currentPosition = this.sprites.attack
                if(!(this.frames >= 8 && this.frames <= 11)){
                    this.frames = 8
                    this.frameTime = this.attack_frame_time
                }
            } 
            
            this.frameTime = this.attack_frame_time  
        }

        if(this.is_walking){
            this.enemyWalkSound()
        }

        this.recovery()

        //this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
    } 

    recovery(){
        if(lastTimestamp - this.recoveryTime > this.lastRecoveryTime){
            if(this.hp < this.max_hp && this.hp > 0){
                this.hp += this.hp_recovery
                if(this.hp > this.max_hp){
                    this.hp = this.max_hp
                }
            }
    
            if(this.sp < this.max_sp){
                this.sp += this.sp_recovery
                if(this.sp > this.max_sp){
                    this.sp = this.max_sp
                }
            }
    
            if(this.stamina < this.max_stamina && this.staminaCoolDown <= 0){
                this.stamina += 1
                if(this.stamina > this.max_stamina){
                    this.stamina = this.max_stamina
                }
            }
            else{
                this.staminaCoolDown -= 1
            }

            if(this.attack_cooldown > 0){
                this.attack_cooldown -= 1
            }

            this.lastRecoveryTime = lastTimestamp
        }
    }

    showBar(){
        var bar_width = 40
        var center_x = (this.position.x + this.width/2) - (bar_width/2)
        //HP bar
        if(this.hp < this.max_hp){
            context.fillStyle = 'black'
            context.fillRect(center_x, this.position.y + this.height+1, bar_width, 4)
            var hp_percent = Math.round(this.hp * 100) / this.max_hp
            var bar_value = (bar_width * hp_percent) / 100
            if(hp_percent<=25){
                context.fillStyle = 'red'
            }else{
                context.fillStyle = 'green'
            }
            context.fillRect(center_x, this.position.y + this.height+1, bar_value, 3)
        }
    }

    frameCheck(first_frame, last_frame, reverse_frames){
        if(!(this.frames >= first_frame && this.frames <= last_frame)){
            if(this.reverse_frame){
                this.frames = last_frame
            }else{
                this.frames = first_frame
            }
            this.lastTimestamp = lastTimestamp
        }
        if(reverse_frames){
            if(this.frames == last_frame){
                this.reverse_frame = true
            }
            if(this.frames == first_frame){
                this.reverse_frame = false
            }
        }        
    }

    newAction(){
        if(this.stun_time > 0){
            if(lastTimestamp - 500 > this.stunLastTimestamp){   
                this.stun_time -= 1
                this.lastTimestamp = lastTimestamp
            }
            return
        }

        this.is_hunt = square_colision_area(player, this.hunt_area)        
        var in_attack_area = square_colision_area(player, this.attack_area)

        if(this.is_hunt && !in_attack_area){            
            this.hunt_side = square_colision_side(player, this)
            this.side = this.hunt_side
            this.huntAction()
        }else{
            this.hunt_side = false   
            this.is_walking = false  
            this.is_attack = false    
        }

        if(in_attack_area){
            this.attack_side = square_colision_side(player, this.attack_area)
            this.side = this.attack_side
            var in_adjust = this.adjustSideAttack()
            if(!in_adjust){
                //this.attackAction()  
                if(this.attack_cooldown <= 0 && !this.is_attack){
                    this.is_attack = true
                    //this.frames = 0
                }
            }
        }else{
            this.attack_side = false
        }

        if(!this.is_hunt){
            this.patrolAction()
        }
    }

    patrolAction(){
        if(!this.patrol){
            return
        }
        if(this.in_battle){
            this.patrol_time_wait = 1000              
            this.in_patrol = false   
        }  
        
        if(!this.in_patrol && this.patrol_time_wait > 0){
            this.patrol_time_wait = this.patrol_time_wait-5   
            return
        }  
    
        if(!this.in_patrol){
            this.in_patrol = true    
            this.patrol_x = this.position.x + random_patrol()
            this.patrol_y = this.position.y + random_patrol() 

            if(this.patrol_x > canvas.width - this.width){
                this.patrol_x = canvas.width - this.width
            }
            if(this.patrol_x < 0){
                this.patrol_x = 0
            }
            if(this.patrol_y > canvas.height - this.height){
                this.patrol_y = canvas.height - this.height
            }
            if(this.patrol_y < 0){
                this.patrol_y = 0
            }
            //console.log('patrol')
        }else{
            if((Math.round(this.patrol_x) == Math.round(this.position.x))
                && (Math.round(this.patrol_y) == Math.round(this.position.y))
                ){                                                   
                this.patrol_time_wait = 1000                    
                this.in_patrol = false            
                this.is_walking = false            
                this.in_patrol_time = 0 
                return          
            }
    
            if(this.in_patrol_time>=500){
                this.in_patrol_time = 0
                this.in_patrol = false
                this.is_walking = false
            }
            this.in_patrol_time+=1
    
            //patrol down/up
            if(Math.round(this.patrol_y) != Math.round(this.position.y)){
                if(this.patrol_y >= this.position.y){
                    if(this.position.y + this.speed > this.patrol_y){
                        this.position.y = this.patrol_y
                    }else{
                        this.position.y += this.speed 
                    }                      
                    this.side = 'down'  
                    //console.log('down:'+this.position.y)                        
                    //this.currentCropHeight = 46*0
                }else{
                    this.position.y -= this.speed                       
                    this.side = 'up'  
                    //console.log('up:'+this.position.y)                        
                    //this.currentCropHeight = 46*3
                } 
                this.is_walking = true
            }

            //patrol left/right
            if(Math.round(this.patrol_x) != Math.round(this.position.x)){
                if(this.patrol_x >= this.position.x){
                    if(this.position.x + this.speed > this.patrol_x){
                        this.position.x = this.patrol_x
                    }else{
                        this.position.x += this.speed
                    }
                    this.side = 'right'                                          
                    //console.log('right:'+this.position.x)
                    //this.currentCropHeight = 46*1
                }else{
                    this.position.x -= this.speed                        
                    this.side = 'left'  
                    //console.log('left:'+this.position.x) 
                    //this.currentCropHeight = 46*2
                }  
                this.is_walking = true
            }
    
        }
    }

    huntAction(){

        //follow right
        if(this.hunt_side == 'right'){
            if(this.follow){
                this.position.x += this.speed
            }          
            this.is_walking = true
    
        //follow left
        }else if(this.hunt_side == 'left'){
            if(this.follow){
                this.position.x -= this.speed
            }            
            this.is_walking = true
        }
    
        //follow down
        if(this.hunt_side == 'down'){
            if(this.follow){
                this.position.y+= this.speed
            }             
            this.is_walking = true
    
        //follow up
        }else if(this.hunt_side == 'up'){
            if(this.follow){
                this.position.y-= this.speed
            }
            this.is_walking = true
        }

    }
    
    attackAction(){

        if(this.attack_cooldown <= 0){
    
            this.is_attack = true
            this.attack_cooldown = this.attack_speed
            enemyAttackSound()
            switch (this.side){
                case 'up':                        
                    var damage = new Damage({
                        x : this.position.x, y : this.position.y, 
                        owner_id : this.id, owner : 'cpu', side : 'up', type : 'attack_soft', 
                        character_width : this.width, character_height: this.height, lastTimestamp : lastTimestamp
                    }); 
                    damages.push(damage)        
                break
    
                case this.side = 'down':
                    var damage = new Damage({
                        x : this.position.x, y : this.position.y, 
                        owner_id : this.id, owner : 'cpu', side : 'down', type : 'attack_soft', 
                        character_width : this.width, character_height: this.height, lastTimestamp : lastTimestamp
                    }); 
                    damages.push(damage)          
                break
    
                case this.side = 'left':
                    var damage = new Damage({
                        x : this.position.x, y : this.position.y, 
                        owner_id : this.id, owner : 'cpu', side : 'left', type : 'attack_soft', 
                        character_width : this.width, character_height: this.height, lastTimestamp : lastTimestamp
                    }); 
                    damages.push(damage)                            
                break
    
                case this.side = 'right':
                    var damage = new Damage({
                        x : this.position.x, y : this.position.y, 
                        owner_id : this.id, owner : 'cpu', side : 'right', type : 'attack_soft', 
                        character_width : this.width, character_height: this.height, lastTimestamp : lastTimestamp
                    }); 
                    damages.push(damage)                            
                break                    
            }
        }else{
            //this.is_attack = false
        }
    }

    adjustSideAttack(){   
            if(!this.follow){                
                this.is_walking = false
                return
            }
    
            var en_r = (this.position.x + this.width/2)
            var p_r = (player.position.x + player.width/2)
    
            var en_l = -(this.position.x + this.width/2)
            var p_l = -(player.position.x + player.width/2)
    
            var en_u = -(this.position.y + this.height/2)
            var p_u = -(player.position.y + player.height/2)
    
            var en_d = (this.position.y + this.height/2)
            var p_d = (player.position.y + player.height/2)
    
            var right = Math.round(en_r - p_r)
            var left = Math.round(en_l - p_l)
            var up = Math.round(en_u - p_u)
            var down = Math.round(en_d - p_d)
            
            // context.font = "12px Arial";
            // context.fillStyle = 'black';
            // context.fillText('right:'+ right,2,20+20);
            // context.fillText('left:'+ left,2,20+40);
            // context.fillText('up:'+ up,2,20+60);
            // context.fillText('down:'+ down,2,20+80);
    
            var distance = [
                { side: 'right', value: right },
                { side: 'left', value: left }
                ,
                { side: 'up', value: up },
                { side: 'down', value: down }
            ]
            //distance.sort((a,b) => a.value + b.value)
    
            distance.sort(function (a,b){
                if (a.value > b.value) {
                    return 1;
                  }
                  if (a.value < b.value) {
                    return -1;
                  }
                  return 0;
            })
    
            distance.sort(function (a,b){
                if (Math.abs(a.value) > Math.abs(b.value)) {
                    return 1;
                }
                if (Math.abs(a.value) < Math.abs(b.value)) {
                    return -1;
                }
                return 0;
            })
    
            this.near_side = distance[0].side
            this.is_walking = true
            var attack_adjust = false
            if(this.near_side == 'left'  && this.position.x + this.width /2 > Math.abs(player.position.x + player.width /2)){
                this.position.x -= this.speed
                // if(distance[0].value < 1.1 && distance[0].value > -1.1){                    
                //     this.position.x = player.position.x
                //     attack_adjust = false
                // }                
                attack_adjust = true
            }else 
            if(this.near_side == 'right'  && this.position.x < Math.abs(player.position.x)){
                this.position.x += this.speed
                // if(distance[0].value < 1.1 && distance[0].value > -1.1){                    
                //     this.position.x = player.position.x
                //     attack_adjust = false
                // } 
                attack_adjust = true
            }else
            if(this.near_side == 'up'  && this.position.y + this.height /2 > Math.abs(player.position.y + player.height /2)){
                this.position.y -= this.speed
                // if(distance[0].value < 1.1 && distance[0].value > -1.1){                    
                //     this.position.y = player.position.y
                //     attack_adjust = false
                // } 
                attack_adjust = true
            }else
            if(this.near_side == 'down'  && this.position.y < player.position.y){
                this.position.y += this.speed
                // if(distance[0].value < 1.1 && distance[0].value > -1.1){                    
                //     this.position.y = player.position.y
                //     attack_adjust = false
                // } 
                attack_adjust = true
            }else{
                this.is_walking = false
                attack_adjust = false
            }
            return attack_adjust
        
    }

    areaDebug(activate){
        if(activate){  
            
            //hunt area
            // context.fillStyle = '#00ffff99'
            // context.fillRect(
            //     this.hunt_area.position.x, 
            //     this.hunt_area.position.y, 
            //     this.hunt_area.width, 
            //     this.hunt_area.height
            // )
            
            //attack area
            // context.fillStyle = '#0000ff99'
            // context.fillRect(
            //     this.attack_area.position.x, 
            //     this.attack_area.position.y, 
            //     this.attack_area.width, 
            //     this.attack_area.height
            // )

            //body
            // context.fillStyle = '#00ff0099'
            // context.fillRect((this.position.x + this.width/2) - (this.currentPosition.width/2), 
            // (this.position.y + this.height - this.currentPosition.cropHeight), 
            // this.currentPosition.width, this.currentPosition.height)
            
            //area
            // context.fillStyle = '#ff000055'
            // context.fillRect(this.position.x, this.position.y, this.width, this.height)
            
            //info area
            context.fillStyle = '#ffffff99'
            context.fillRect(
                this.position.x + 140, 
                this.position.y - 40, 
                130, 
                130
            )
            
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('is_walking: '+this.is_walking,this.position.x + 150,this.position.y - 20)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('is_hunt: '+this.is_hunt,this.position.x + 150,this.position.y - 10)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('is_attack: '+this.is_attack,this.position.x + 150,this.position.y - 0)
            
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('side: '+this.side,this.position.x + 150,this.position.y + 10)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('hunt_side: '+this.hunt_side,this.position.x + 150,this.position.y + 20)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('attack_side: '+this.attack_side,this.position.x + 150,this.position.y + 30)            
            
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('in_battle: '+this.in_battle,this.position.x + 150,this.position.y + 40)
            
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('near_side: '+this.near_side,this.position.x + 150,this.position.y + 50)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('atk_cooldown: '+Math.round(this.attack_cooldown),this.position.x + 150,this.position.y + 60)
            
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('atk_frm_count: '+this.attack_frame_count,this.position.x + 150,this.position.y + 70)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('frame: '+this.frames,this.position.x + 150,this.position.y + 80)
        }
    }

    enemyWalkSound(){
        //this.sound_w = new Audio("./src/sound/ork_warrior_step1.wav")
        this.walk_sound.play()
    }
    
}

function random_patrol(){    
    val = Math.round(Math.random() * (100 - 1) + 1)
    s = Math.random() * (3 - 1) + 1
    
    if(s>2){
        return +val
    }else{
        return -val
    }
}

//const walk_sound = new Audio("./src/sound/ork_warrior_step1.wav")





