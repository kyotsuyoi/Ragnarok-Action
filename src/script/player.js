class Player{
    constructor(id, lastTimestamp, x, y){
        this.id = id
        this.start = false
        this.layer = y
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
        this.speed = 1.5
        this.frames = 0
        this.head_frame = 0
        this.lastTimestamp = lastTimestamp
        this.last_movement_timestamp = lastTimestamp

        this.frameTime = 0
        this.standFrameTime = 1000
        this.walkingFrameTime = 100
        this.runningFrameTime = this.walkingFrameTime/2
        this.attackingFrameTime = 100
        this.recoveryTime = 100     
        this.lastRecoveryTime = lastTimestamp

        this.power = 10
        this.agility = 10
        this.dexterity = 12
        this.vitality = 12
        this.inteligence = 10

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

        this.sprites = {
            stand : {                
                spriteSheet : createImage('./src/image/female_novice_stand.png'),
                cropX : 0,
                cropY : 0,
                cropWidth : 48,
                cropHeight : 75,
                width : 48,
                height : 75
            },
            walking : {
                spriteSheet : createImage('./src/image/female_novice_walking_n2.png'),
                cropX : -0.5,
                cropY : -1,
                cropWidth : 51,
                cropHeight : 76,
                width : 51,
                height : 76
            },
            head : {
                spriteSheet : createImage('./src/image/female_head_red_1.png'),
                cropX : 0.5,
                cropY : 0,
                cropWidth : 33,
                cropHeight : 38,
                width : 33,
                height : 38,                
                adjust_x : 0,
                adjust_y : 0
            },
            attack_soft : {
                spriteSheet : createImage('./src/image/female_novice_attack_soft.png'),
                cropX : 0,
                cropY : 0,
                cropWidth : 60,
                cropHeight : 72,
                width : 60,
                height : 72
            },
            attack_hard : {
                spriteSheet : createImage('./src/image/female_novice_attack_hard.png'),
                cropX : 0.5,
                cropY : 0,
                cropWidth : 55,
                cropHeight : 83,
                width : 55,
                height : 83
            }
        }
        this.currentPosition = this.sprites.stand  
        
        this.body_center_x = 0
        this.body_center_y = 0

        this.is_walking = false
        this.is_attack = false
        this.is_attack_hard = false
        this.side = 'down'
        lastKey = 'down'
        
        this.attack_cooldown = 0
        this.staminaCoolDown = 0
        this.attack_frame_count = 0
        this.attack_hard_cooldown = 0

        this.is_running = false
        this.is_defending = false
        this.attack_hit = true
        this.attack_hard_hit = true

    }

    draw(){

        var radius = 15
        context.beginPath()
        context.arc(player.position.x + player.width/2, player.position.y + (player.height/4)*2 + 12, radius, 0, 2 * Math.PI, false)
        context.fillStyle = '#00000055'
        context.fill()

        this.areaDebug(false)

        this.body_center_x = (this.position.x + this.width/2) - (this.currentPosition.width/2)
        this.body_center_y = (this.position.y + this.height - this.currentPosition.cropHeight)

        
        if(this.is_attack_hard){            
            if(this.side == 'up' || this.side == 'right' && (this.attack_frame_count == 0 || this.attack_frame_count == 1)){
                this.drawHead()
                this.drawBody()
            }else{
                this.drawBody()
                this.drawHead()
            }
        }else{
            this.drawBody()
            this.drawHead()
        }
                 
        
        this.showBar()
    }

    drawBody(){
        context.drawImage(          
            this.currentPosition.spriteSheet, 
            this.currentPosition.cropX + this.currentPosition.width * this.frames, //corte no eixo x
            this.currentPosition.cropY, //corte no eixo y
            this.currentPosition.cropWidth, //largura do corte
            this.currentPosition.cropHeight, //altura do corte
            this.body_center_x, 
            this.body_center_y,
            this.currentPosition.width,
            this.currentPosition.height
        ) 
    }

    drawHead(){
        context.drawImage(          
            this.sprites.head.spriteSheet, 
            this.sprites.head.cropX + this.sprites.head.width * this.head_frame, //corte no eixo x
            this.sprites.head.cropY, //corte no eixo y
            this.sprites.head.cropWidth, //largura do corte
            this.sprites.head.cropHeight, //altura do corte
            (this.position.x + this.width/2) - (this.sprites.head.width/2) + this.sprites.head.adjust_x, 
            (this.position.y - this.height/2 +16) - this.sprites.head.cropHeight + this.sprites.head.adjust_y,
            this.sprites.head.width,
            this.sprites.head.height
        ) 
    }

    update(){ 
                       
        if(lastTimestamp - this.frameTime > this.lastTimestamp){
            if(this.is_attack || this.is_walking || this.is_attack_hard){
                this.frames++ 
            }           
            this.lastTimestamp = lastTimestamp
            if(this.is_attack || this.is_attack_hard){
                this.attack_frame_count++
            }
        }
        
        this.layer = this.position.y
        
        //stand
        if(!this.is_attack && !this.is_walking && !this.is_attack_hard){
            if(lastKey === 'right'){
                this.side = 'right'
                this.currentPosition = this.sprites.stand 
                this.frames = 6
                this.head_frame = 6
        
            } else if (lastKey === 'left'){       
                this.side = 'left'
                this.currentPosition = this.sprites.stand 
                this.frames = 2
                this.head_frame = 2
            
            } else if (lastKey === 'down'){        
                this.side = 'down'
                this.currentPosition = this.sprites.stand 
                this.frames = 0
                this.head_frame = 0
            
            } else if (lastKey === 'up'){        
                this.side = 'up'
                this.currentPosition = this.sprites.stand 
                this.frames = 4
                this.head_frame = 4
            }    
            //this.lastTimestamp = lastTimestamp        
        }
        
        //walk or run        
        this.speed = speed_value(this.agility)
        if(this.is_running && !this.is_defending && this.stamina > 0){
            this.speed = speed_value(this.agility)*2
            this.stamina -= 0.5
        }        
        if(this.is_defending){
            this.speed = speed_value(this.agility)/2
        }

        if (!this.is_attack && this.is_walking){ 
            if(lastKey === 'right'){
                this.side = 'right'
                this.head_frame = 6
                this.currentPosition = this.sprites.walking
                if(!(this.frames >= 8*6 && this.frames <= 8*7-2)){
                    this.frames = 8*6
                }   
            } else if (lastKey === 'left'){       
                this.side = 'left'
                this.head_frame = 2
                this.currentPosition = this.sprites.walking 
                if(!(this.frames >= 8*2+1 && this.frames < 8*3)){
                    this.frames = 8*2+1
                } 
            } else if (lastKey === 'down'){        
                this.side = 'down'
                this.head_frame = 0
                this.currentPosition = this.sprites.walking 
                if(!(this.frames >= 0 && this.frames < 8)){
                    this.frames = 0
                }
            } else if (lastKey === 'up'){        
                this.side = 'up'
                this.head_frame = 4
                this.currentPosition = this.sprites.walking
                if(!(this.frames >= 8*4 && this.frames <= 8*5-1)){
                    this.frames = 8*4
                }
            }  
            this.frameTime = this.walkingFrameTime  
            if(this.is_running){
                this.frameTime = this.runningFrameTime
            }
        }          
        
        if(this.is_attack && this.attack_frame_count > 5){
            this.is_attack = false
            this.attack_frame_count = 0
            this.currentPosition = this.sprites.stand
        }

        if(this.is_attack_hard && this.attack_frame_count > 3){
            this.is_attack_hard = false
            this.attack_frame_count = 0
            this.currentPosition = this.sprites.stand
        }

        if(this.attack_frame_count == 3 && !this.attack_hit){
            var damage = new Damage({
                x : player.position.x, y : player.position.y, 
                owner_id : 'p1', owner : 'player', type : 'attack_soft', side : player.side, 
                character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
            }); 
            damages.push(damage)   
            attackSound()
            this.attack_hit = true
        }    
        
        if(this.attack_frame_count == 3 && !this.attack_hard_hit){
            var damage = new Damage({
                x : player.position.x, y : player.position.y, 
                owner_id : 'p1', owner : 'player', type : 'attack_hard', side : player.side, 
                character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
            }); 
            damages.push(damage)   
            attackSound()
            this.attack_hard_hit = true
        }  

        //attack
        if(this.is_attack){            
            if(this.side === 'right'){
                this.head_frame = 6
                this.currentPosition = this.sprites.attack_soft 
                if(!(this.frames >= 15 && this.frames <= 19)){
                    this.frames = 15
                    this.frameTime = this.attackingFrameTime
                }   
            } else if (this.side === 'left'){    
                this.head_frame = 2
                this.currentPosition = this.sprites.attack_soft 
                if(!(this.frames >= 5 && this.frames <= 9)){
                    this.frames = 5
                    this.frameTime = this.attackingFrameTime
                } 
            } else if (this.side === 'down'){   
                this.head_frame = 0
                this.currentPosition = this.sprites.attack_soft 
                if(!(this.frames >= 0 && this.frames <= 4)){
                    this.frames = 0
                    this.frameTime = this.attackingFrameTime
                }
            } else if (this.side === 'up'){    
                this.head_frame = 4
                this.currentPosition = this.sprites.attack_soft
                if(!(this.frames >= 10 && this.frames <= 14)){
                    this.frames = 10
                    this.frameTime = this.attackingFrameTime
                }
            } 
            
            this.frameTime = this.attackingFrameTime  
        }

        if(this.is_attack_hard){            
            if(this.side === 'right'){
                this.head_frame = 6
                this.currentPosition = this.sprites.attack_hard
                if(!(this.frames >= 12 && this.frames <= 15)){
                    this.frames = 12
                    this.frameTime = this.attackingFrameTime
                }   
            } else if (this.side === 'left'){    
                this.head_frame = 2
                this.currentPosition = this.sprites.attack_hard 
                if(!(this.frames >= 4 && this.frames <= 7)){
                    this.frames = 4
                    this.frameTime = this.attackingFrameTime
                } 
            } else if (this.side === 'down'){   
                this.head_frame = 0
                this.currentPosition = this.sprites.attack_hard 
                if(!(this.frames >= 0 && this.frames <= 3)){
                    this.frames = 0
                    this.frameTime = this.attackingFrameTime
                }
            } else if (this.side === 'up'){    
                this.head_frame = 4
                this.currentPosition = this.sprites.attack_hard
                if(!(this.frames >= 8 && this.frames <= 11)){
                    this.frames = 8
                    this.frameTime = this.attackingFrameTime
                }
            } 
            
            this.frameTime = this.attackingFrameTime  
        }
        
        this.headAdjust()
              
        this.recovery()
        this.movement()

        //this.draw()
        // this.position.x += this.velocity.x
        // this.position.y += this.velocity.y
    }

    movement(){
        if(lastTimestamp - this.speed > this.last_movement_timestamp){
            // var move_x = Math.round(this.position.x + this.velocity.x)
            // var move_y = Math.round(this.position.y + this.velocity.y)
            var move_x = this.position.x + this.velocity.x
            var move_y = this.position.y + this.velocity.y
            this.position.x = move_x
            this.position.y = move_y           
            this.last_movement_timestamp = lastTimestamp
        }
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

            if(this.attack_hard_cooldown > 0){
                this.attack_hard_cooldown -= 1
            }

            this.lastRecoveryTime = lastTimestamp
        } 
    }

    showBar(){
        //var x_abs = this.position.x - Math.abs(this.width/2 - 20)
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

        //SP bar
        if(this.sp < this.max_sp){
            context.fillStyle = 'black'
            context.fillRect(center_x, this.position.y + this.height+4, bar_width, 4)
            var sp_percent = Math.round(this.sp * 100) / this.max_sp
            var bar_value = (bar_width * sp_percent) / 100
            context.fillStyle = 'blue'        
            context.fillRect(center_x, this.position.y + this.height+4, bar_value, 3)
        }

        //Stamina bar
        if(this.stamina < this.max_stamina){
            context.fillStyle = 'black'
            context.fillRect(center_x, this.position.y + this.height+8, bar_width, 4)
            var stamina_percent = Math.round(this.stamina * 100) / this.max_stamina
            var bar_value = (bar_width * stamina_percent) / 100
            if(stamina_percent<=25){
                context.fillStyle = 'orange'
            }else{
                context.fillStyle = 'yellow'
            }       
            context.fillRect(center_x, this.position.y + this.height+8, bar_value, 3)
        }
    }

    areaDebug(activate){
        if(activate){
                
            //body
            // context.fillStyle = '#00ff0099'
            // context.fillRect((this.position.x + this.width/2) - (this.currentPosition.width/2), 
            // (this.position.y + this.height - this.currentPosition.cropHeight), 
            // this.currentPosition.width, this.currentPosition.height)
            
            // //area
            // context.fillStyle = '#ff000055'
            // context.fillRect(this.position.x, this.position.y, this.width, this.height)

            // //head
            // context.fillStyle = '#ff000099'
            // context.fillRect((this.position.x + this.width/2) - (this.sprites.head.width/2) + this.sprites.head.adjust_x, 
            // (this.position.y - this.height/2 +16) - this.sprites.head.cropHeight + this.sprites.head.adjust_y, 
            // this.sprites.head.width, this.sprites.head.height)

            //info area
            context.fillStyle = '#ffffff99'
            context.fillRect(
                this.position.x + 140, 
                this.position.y - 40, 
                130, 
                100
            )
            
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('is_walking: '+this.is_walking,this.position.x + 150,this.position.y - 20)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('is_attack: '+this.is_attack,this.position.x + 150,this.position.y - 10)
            
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('side: '+this.side,this.position.x + 150,this.position.y + 0)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('atk_sf_cdn: '+this.attack_cooldown,this.position.x + 150,this.position.y + 10)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('atk_hd_cdn: '+this.attack_hard_cooldown,this.position.x + 150,this.position.y + 20)

            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('speed: '+this.speed,this.position.x + 150,this.position.y + 30)
            
            var damages_count = damages.filter(damage => damage.owner_id == 'p1')
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('damages_count: '+damages_count.length,this.position.x + 150,this.position.y + 40)
            
            var damages_count = damages.filter(damage => damage.owner_id == 'p1')
            context.font = "12px Arial black"
            context.fillStyle = 'black'
            context.fillText('hp: '+Math.round(this.hp),this.position.x + 150,this.position.y + 50)
        }
    }

    headAdjust(){
        
        this.sprites.head.adjust_x = 0
        this.sprites.head.adjust_y = 0

        if(this.is_attack){
            switch (this.side){
                case 'down':
                    if((this.attack_frame_count <= 2 || this.attack_frame_count == 5)){
                        this.sprites.head.adjust_x = -2
                        this.sprites.head.adjust_y = 8
                    }

                    if(this.attack_frame_count == 4){
                        this.sprites.head.adjust_x = 7                
                        this.sprites.head.adjust_y = 7
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = 7                
                        this.sprites.head.adjust_y = 6
                    }
                break

                case 'left':
                    if((this.attack_frame_count <= 2 || this.attack_frame_count == 5)){
                        this.sprites.head.adjust_x = -2
                        this.sprites.head.adjust_y = 8
                    }

                    if(this.attack_frame_count == 4){
                        this.sprites.head.adjust_x = -7                
                        this.sprites.head.adjust_y = 7
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = -7                
                        this.sprites.head.adjust_y = 6
                    }
                break
                
                case 'right':
                    if((this.attack_frame_count <= 2 || this.attack_frame_count == 5)){
                        this.sprites.head.adjust_x = 2
                        this.sprites.head.adjust_y = 8
                    }

                    if(this.attack_frame_count == 4){
                        this.sprites.head.adjust_x = 2          
                        this.sprites.head.adjust_y = 7
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = 3            
                        this.sprites.head.adjust_y = 8
                    }
                break

                case 'up':
                    if((this.attack_frame_count <= 2 || this.attack_frame_count == 5)){
                        this.sprites.head.adjust_x = -2
                        this.sprites.head.adjust_y = 8
                    }

                    if(this.attack_frame_count == 4){
                        this.sprites.head.adjust_x = -3                
                        this.sprites.head.adjust_y = 7
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = -5               
                        this.sprites.head.adjust_y = 6
                    }
                break
            }
        }

        if(this.is_attack_hard){
            switch (this.side){
                case 'down':
                    if(this.attack_frame_count == 0){
                        this.sprites.head.adjust_x = 3
                        this.sprites.head.adjust_y = 7
                    }

                    if((this.attack_frame_count == 1)){
                        this.sprites.head.adjust_x = 1
                        this.sprites.head.adjust_y = 7
                    }

                    if(this.attack_frame_count == 2){
                        this.sprites.head.adjust_x = 8
                        this.sprites.head.adjust_y = 11
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = 8
                        this.sprites.head.adjust_y = 12
                    }
                break

                case 'left':
                    if(this.attack_frame_count == 0){
                        this.sprites.head.adjust_x = -7
                        this.sprites.head.adjust_y = 6
                    }

                    if((this.attack_frame_count == 1)){
                        this.sprites.head.adjust_x = -5
                        this.sprites.head.adjust_y = 6
                    }

                    if(this.attack_frame_count == 2){
                        this.sprites.head.adjust_x = -8
                        this.sprites.head.adjust_y = 12
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = -8
                        this.sprites.head.adjust_y = 13
                    }
                break
                
                case 'right':
                    if(this.attack_frame_count == 0){
                        this.sprites.head.adjust_x = 2
                        this.sprites.head.adjust_y = 4
                    }

                    if((this.attack_frame_count == 1)){
                        this.sprites.head.adjust_x = -2
                        this.sprites.head.adjust_y = 5
                    }

                    if(this.attack_frame_count == 2){
                        this.sprites.head.adjust_x = 5
                        this.sprites.head.adjust_y = 9
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = 5
                        this.sprites.head.adjust_y = 10
                    }
                break

                case 'up':
                    if(this.attack_frame_count == 0){
                        this.sprites.head.adjust_x = -1
                        this.sprites.head.adjust_y = 4
                    }

                    if((this.attack_frame_count == 1)){
                        this.sprites.head.adjust_x = 3
                        this.sprites.head.adjust_y = 4
                    }

                    if(this.attack_frame_count == 2){
                        this.sprites.head.adjust_x = -5
                        this.sprites.head.adjust_y = 8
                    }
                    
                    if(this.attack_frame_count == 3){
                        this.sprites.head.adjust_x = -5
                        this.sprites.head.adjust_y = 9
                    }
                break
            }
        }


    }
}