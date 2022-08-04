class Damage{
    constructor({id, x, y, owner_id, owner, type, side, character_width, character_height, lastTimestamp}){
        this.id = id
        this.type = type
        this.position ={
            x,
            y
        }
        this.velocity={
            x : 0,
            y : 0
        }
        this.width = 42
        this.height = 42
        this.speed = 4
        this.targetRange = 150 

        this.lastDamage = new Array() //saves id of target that has already taken damage

        this.frameTime = 30
        this.frames = 0
        this.time = 15
        this.damageCount = 1//for mult damages
        this.lastTimestamp = lastTimestamp
        this.positionTimestamp = lastTimestamp
        this.finished = false
        this.isKnockBack = true //enable or disable knock back

        this.owner = owner
        this.owner_id = owner_id

        this.setType()  

        this.type = type          
        this.side = side
        
        switch (side){
            case 'up':
                this.position.x = (x + character_width /2) - (this.height/2)
                this.position.y = y - this.height/2 + character_height /2//- this.width //- this.height
                this.currentCropHeight = 42*2
                this.velocity.y = -this.speed
            break

            case 'down':
                this.position.x = (x + character_width /2) - (this.height/2)
                this.position.y = y - this.height/2 + character_height /2 //+ character_height 
                this.currentCropHeight = 42*3
                this.velocity.y = this.speed
            break

            case 'left':
                this.position.x = x - this.width/2 + character_width /2//- this.width
                this.position.y = (y + character_height /2) - (this.height/2) 
                this.currentCropHeight = 0
                this.velocity.x = -this.speed
            break

            case 'right':
                this.position.x = x - this.width/2 + character_width /2//+ character_width 
                this.position.y = (y + character_height /2) - (this.height/2)
                this.currentCropHeight = 42
                this.velocity.x = this.speed
            break
        }
             
    }

    draw(){
        this.areaDebug(false)

        context.drawImage(          
            this.currentSprite, 
            this.currentCropWidth * this.frames,
            this.currentCropHeight,
            this.sprites.width, //largura
            this.sprites.height, //altura
            this.position.x, 
            this.position.y-25,
            this.width,
            this.height
        )
    }

    update(){
        if(lastTimestamp - this.frameTime > this.lastTimestamp){
            this.frames++            
            this.lastTimestamp = lastTimestamp
        }

        if(this.frames > 3){            
            this.frames = 0
            this.lastTimestamp = lastTimestamp
        } 

        if(lastTimestamp - 2 > this.positionTimestamp){            
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.positionTimestamp = lastTimestamp
        }
        this.draw()
        this.action()
    }

    action(){
        if(this.time <= 0){
            
            switch(this.type){
    
                case 'a':
                     
                break
    
                case 'b':
                    
                break
    
                case 'c':
                    
                break
    
                default:
                    this.finished = true
            }
    
        }else{
            this.time -= 1
            //this.draw()
    
            if(this.owner_id == 'p1' || this.owner_id == 'p2'){
                if(this.type == 'cure'){
                    // playerCure(this, player)
                    // if(player2 != null){
                    //     playerCure(this, player2)
                    // }                
                }else{
                    this.playerDamage()
                }
            }  
            
            if(this.owner == 'cpu'){
                this.enemyDamage(player)
                //this.enemyDamage(player2)
            }
        }
    }
    
    enemyDamage(player){
    
        if(player == null){
            return
        }
        
        if (square_colision_area(this, player)) {
              
            //If enemy is dead
            var enemy = enemies.find(element => element.id == this.owner_id)
            if(enemy == undefined){
                //console.log('undefined enemy')
                return
            } 
    
            //if the player has already been hit
            var id = this.lastDamage.filter(element => element == player.id)
            if(id == 'p1' || id == 'p2'){
                return
            }
            this.lastDamage.push(player.id)          
    
            var is_hit = dexterity_vs_flee(enemy.dexterity, player.agility)            
            if(player.defending){
                is_hit = true
            }
    
            if(is_hit){   
    
                var result = attack_vs_defense(enemy.attack, enemy.dexterity, player.defense)
                if(player.defending){ 
    
                    res_stm = player.stamina - result
                    if(res_stm < 0){
                        player.stamina = 0 
                        player.defending = false
                        //result += Math.round(res_stm)
                        //result += res_stm
                        player.hp += res_stm  
                        if(player.hp <= 0){
                            player.hp = 0.0
                        }                       
                        attackHitSound()                         
                        var display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'red', text : result, type : 'damage'})
                        displays.push(display)
    
                    }else{
                        shieldSound()
                        player.stamina = player.stamina - stamina_vs_attack(player.defense, result)
                        //damages.pop(damage)
                        this.finished = true
                    }  
                    
                    player.staminaCoolDown = 50
    
                }else{
                    var result = attack_vs_defense(enemy.attack, enemy.dexterity, player.defense)
                    player.hp -= result  
                    if(player.hp < 0){
                        player.hp = 0
                    }                  
                    attackHitSound()          
                    var display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'red', text : result, type : 'damage'})
                    displays.push(display)
                }
                
                if(this.isKnockBack){
                    switch (this.side){
                        case 'up': 
                            if(player.position.y <= 0){
                                player.position.y = 0
                            }else{
                                player.position.y -= knock_back(this.power, enemy.power, player.power)
                            }                      
                        break
        
                        case 'down':
                            if(player.position.y + player.height >= canvas.height){
                                player.position.y = canvas.height - player.height
                            }else{
                                player.position.y += knock_back(this.power, enemy.power, player.power)
                            }
                        break
        
                        case 'left':
                            if(player.position.x <= 0){
                                player.position.x = 0
                            }else{
                                player.position.x -= knock_back(this.power, enemy.power, player.power)
                            }
                        break
        
                        case 'right':
                            if(player.position.x + player.width >= canvas.width){
                                player.position.x = canvas.width - player.width
                            }else{
                                player.position.x += knock_back(this.power, enemy.power, player.power)
                            }
                        break                    
                    }
                }
    
            }else{
                var display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
                displays.push(display)
            }  
    
            if(player.hp <= 0){
                return
            }
        }
    }
    
    playerDamage(){
        enemies.forEach(enemy => {
            if(this.owner == 'cpu'){
                console.log('wrong damage detected')
            }
            if(enemy.die){
                return
            }
            if (square_colision_area(this, enemy)) {
                
                //this is to not double damage
                var p = this.lastDamage.filter(element => element == enemy.id)
                if(p == enemy.id){
                    return
                }
                this.lastDamage.push(enemy.id)
                
                var is_hit = false
                switch(this.owner_id){
                    case 'p1':
                        is_hit = dexterity_vs_flee(player.dexterity + this.bonus_dexterity, enemy.agility)
                    break
                    case 'p2':
                        is_hit = dexterity_vs_flee(player.dexterity + this.bonus_dexterity, enemy.agility)
                    break
                }                    
                
                if(is_hit){                        
                    var result = 0
                    switch(this.owner_id){
                        case 'p1':
                            result = attack_vs_defense(player.attack + this.bonus_attack, player.dexterity + this.bonus_dexterity, enemy.defense)
                        break
                        case 'p2':
                            result = attack_vs_defense(player2.attack + this.bonus_attack, player2.dexterity + this.bonus_dexterity, enemy.defense)
                        break
                    }  
    
                    enemy.hp -= result   
                    enemy.stunTime = this.stun    
                    attackHitSound()    
                    if(enemy.hp <= 0){
                        enemy.hp = 0
                        enemy.die = true
                        enemy.frames = -1
                        enemy.layer = 0
                        enemyDieScreemSound()
                    }          
                    var display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'red', text : result, type : 'damage'})
                    displays.push(display)
    
                    if(!enemy.knock_back || !this.isKnockBack){
                        return
                    }
    
                    switch(this.owner_id){
                        case 'p1':
                            switch (player.side){
                                case 'up':                        
                                    enemy.position.y -= knock_back(this.power, player.power, enemy.power)
                                break
            
                                case 'down':
                                    enemy.position.y += knock_back(this.power, player.power, enemy.power)
                                break
            
                                case 'left':
                                    enemy.position.x -= knock_back(this.power, player.power, enemy.power)
                                break
            
                                case 'right':
                                    enemy.position.x += knock_back(this.power, player.power, enemy.power)
                                break 
                            }
                        break  
    
                        case 'p2':
                            switch (player2.side){
                                case 'up':                        
                                    enemy.position.y -= knock_back(this.power, player2.power, enemy.power)
                                break
            
                                case 'down':
                                    enemy.position.y += knock_back(this.power, player2.power, enemy.power)
                                break
            
                                case 'left':
                                    enemy.position.x -= knock_back(this.power, player2.power, enemy.power)
                                break
            
                                case 'right':
                                    enemy.position.x += knock_back(this.power, player2.power, enemy.power)
                                break 
                            }
                        break                             
                    }
                }else{
                    var display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
                    displays.push(display)
                }    
            }
        }) 
    }

    setType(){   
        this.power = 0 //knock back only
        this.bonus_attack = 0
        this.bonus_dexterity = 0
        this.stun = 0

        this.sprites = {
            sprite : null,
            width : null,
            height : null             
        }
        
        this.currentCropWidth = 42
        this.currentCropHeight = 0

        switch (this.type){
            case 'attack_soft':
                this.power = 1 //knock back only
                this.bonus_attack = 0
                this.bonus_dexterity = 0
                this.stun = 10

                this.sprites.sprite = createImage('./src/image/sword_attack.png')
                this.sprites.width = this.width
                this.sprites.height = this.height
                
                this.currentCropWidth = 42
                this.currentCropHeight = 0
            break

            case 'attack_hard':
                this.power = 30 //knock back only
                this.bonus_attack = 10
                this.bonus_dexterity = 10
                this.stun = 20

                this.sprites.sprite = createImage('./src/image/sword_attack.png')
                this.sprites.width = this.width
                this.sprites.height = this.height
                
                this.currentCropWidth = 42
                this.currentCropHeight = 0
            break
        }
        
        this.currentSprite = this.sprites.sprite
 
    }
    
    areaDebug(activate){
        if(activate){
                
            //body
            // context.fillStyle = '#00ff0099'
            // context.fillRect((this.position.x + this.width/2) - (this.sprites.width/2), 
            // (this.position.y + this.height - this.sprites.cropHeight), 
            // this.sprites.width, this.sprites.height)
            
            //area
            context.fillStyle = '#ff000055'
            context.fillRect(this.position.x, this.position.y, this.width, this.height)

        }
    }
}