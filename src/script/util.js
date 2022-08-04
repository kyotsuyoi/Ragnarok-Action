
function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}

function square_colision_area(a, b){
    if(
        a.position.x < b.position.x + b.width &&
        a.position.x + a.width > b.position.x &&
        a.position.y < b.position.y + b.height &&
        a.position.y + a.height > b.position.y
    ){
        return true
    }

    return false
}

function square_colision_side_old(a, b){

    var distance_x = Math.abs(a.position.x - b.position.x)
    var distance_y = Math.abs(a.position.y - b.position.y)

    hunt_right = a.position.x > b.position.x + b.width && distance_x < b.target_range && distance_y < b.target_range
    hunt_left = b.position.x > a.position.x + a.width && distance_x < b.target_range && distance_y < b.target_range
    hunt_down = a.position.y > b.position.y + b.height && distance_y < b.target_range && distance_x < b.target_range
    hunt_up = b.position.y > a.position.y + a.height && distance_y < b.target_range && distance_x < b.target_range 

    if(!hunt_right && !hunt_left && !hunt_left && !hunt_down && !hunt_up){
        return false
    }

    if(distance_x > distance_y){
        if(hunt_right){
            return 'right'
        }else{
            return 'left'
        }
    }else{
        if(hunt_up){
            return 'up'
        }else{
            return 'down'
        }
    }
}

function square_colision_side(a, b){

    var distance_x = Math.abs((a.position.x + a.width /2) - (b.position.x + b.width /2))
    var distance_y = Math.abs((a.position.y + a.height /2) - (b.position.y + b.height /2))

    hunt_right = a.position.x + a.width /2 > b.position.x + b.width /2
    hunt_left = a.position.x + a.width /2 < b.position.x + b.width /2
    hunt_down = a.position.y + a.height /2 > b.position.y + b.height /2
    hunt_up = a.position.y + a.height /2 < b.position.y + b.height /2

    if(distance_x > distance_y){
        if(!hunt_left && !hunt_right){
            return false
        }

        if(hunt_right){
            return 'right'
        }else{
            return 'left'
        }
    }else{
        if(!hunt_down && !hunt_up){
            return false
        }

        if(hunt_up){
            return 'up'
        }else{
            return 'down'
        }
    }
}
