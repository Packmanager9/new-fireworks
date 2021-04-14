
    let blocktangles = []

    let start = Math.random()
    let score = 0
    let geartext = String.fromCodePoint(0x00002699)
    let raystore = 375

    let TIP_engine = {}
    let angleRadians

    //  let fruitsong = new Audio('fruitsong.wav');

     let turn = -1
    let settings = -1
    let deathtrigger = 0
    let enemies = []
    let storytext = ""
    let money = 500
    let instore = 0
    let storyprompt = 0


    let musict = -1
    let turnt = -1

    // let instore = 0
    let level = 1
    let timer = 60000
    let storyp = 0
    let zenp = 0
    
    let yt = 0
    let xt = 0
    let floors = []
    let gravity = .03
    let friction = .999
    let mouse = false
    let keysPressed = {}

window.addEventListener('DOMContentLoaded', (event) => {
    const gamepadAPI = {
        controller: {},
        turbo: true,
        connect: function (evt) {
            if (navigator.getGamepads()[0] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[1] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[2] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[3] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            }
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] === null) {
                    continue;
                }
                if (!gamepads[i].connected) {
                    continue;
                }
            }
        },
        disconnect: function (evt) {
            gamepadAPI.turbo = false;
            delete gamepadAPI.controller;
        },
        update: function () {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.buttonsCache = [];// clear the buttons cache
            for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
                gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
            }
            gamepadAPI.buttonsStatus = [];// clear the buttons status
            var c = gamepadAPI.controller || {}; // get the gamepad object
            var pressed = [];
            if (c.buttons) {
                for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                    if (c.buttons[b].pressed) {
                        pressed.push(gamepadAPI.buttons[b]);
                    }
                }
            }
            var axes = [];
            if (c.axes) {
                for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                    axes.push(c.axes[a].toFixed(2));
                }
            }
            gamepadAPI.axesStatus = axes;// assign received values
            gamepadAPI.buttonsStatus = pressed;
            // console.log(pressed); // return buttons for debugging purposes
            return pressed;
        },
        buttonPressed: function (button, hold) {
            var newPress = false;
            for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
                if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                    newPress = true;// set the boolean variable to true
                    if (!hold) {// if we want to check the single press
                        for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                            if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                                newPress = false;
                            }
                        }
                    }
                }
            }
            return newPress;
        },
        buttons: [
            'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
        ],
        buttonsCache: [],
        buttonsStatus: [],
        axesStatus: []
    };
    let canvas
    let canvas_context

    class Circle {
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
            this.strokeWidth = strokeWidth
            this.strokeColor = strokeColor
        }
        draw() {
            canvas_context.lineWidth = this.strokeWidth
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                canvas_context.fillStyle = this.color
                canvas_context.fill()
                canvas_context.stroke();
            } else {
                console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
        }

        drawx() {
            canvas_context.lineWidth = this.strokeWidth
            // canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius*10, 0, (Math.PI * 2), true)
                // canvas_context.fillStyle = this.color
                canvas_context.fill()
                // canvas_context.stroke();
            } else {
                console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                        this.reflected = 1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                        this.reflected = 1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                        this.reflected = 1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                        this.reflected = 1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
        }
        unmove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                        this.reflected = 1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                        this.reflected = 1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                        this.reflected = 1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                        this.reflected = 1
                    }
                }
            }
            this.x -= this.xmom
            this.y -= this.ymom
        }
        frictiveMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
            this.xmom *= this.friction
            this.ymom *= this.friction
        }
        frictiveunMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.xmom /= this.friction
            this.ymom /= this.friction
            this.x -= this.xmom
            this.y -= this.ymom
        }
        isPointInside(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                return true
            }
            return false
        }
        doesPerimeterTouch(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                return true
            }
            return false
        }
    }
    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        angle() {
            return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            return Math.sqrt(hypotenuse)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }class Polygon {
        constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
            if (sides < 2) {
                sides = 2
            }
            this.reflect = reflect
            this.xmom = xmom
            this.ymom = ymom
            this.body = new Circle(x, y, size - (size * .293), "transparent")
            this.nodes = []
            this.angle = angle
            this.size = size
            this.color = color
            this.angleIncrement = (Math.PI * 2) / sides
            this.sides = sides
            for (let t = 0; t < sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
        }
        isPointInside(point) { // rough approximation
            this.body.radius = this.size - (this.size * .293)
            if (this.sides <= 2) {
                return false
            }
            this.areaY = point.y - this.body.y
            this.areaX = point.x - this.body.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
                return true
            }
            return false
        }
        move() {
            if (this.reflect == 1) {
                if (this.body.x > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.body.x < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.body.x += this.xmom
            this.body.y += this.ymom
        }
        draw() {
            this.nodes = []
            this.angleIncrement = (Math.PI * 2) / this.sides
            this.body.radius = this.size - (this.size * .293)
            for (let t = 0; t < this.sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
            canvas_context.strokeStyle = this.color
            canvas_context.fillStyle = this.color
            canvas_context.lineWidth = 0
            canvas_context.beginPath()
            canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
            for (let t = 1; t < this.nodes.length; t++) {
                canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
            }
            canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
            canvas_context.fill()
            canvas_context.stroke()
            canvas_context.closePath()
        }
    }
    class Shape {
        constructor(shapes) {
            this.shapes = shapes
        }
        isPointInside(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].isPointInside(point)) {
                    return true
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return true
                }
            }
            return false
        }
        isInsideOf(box) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (box.isPointInside(this.shapes[t])) {
                    return true
                }
            }
            return false
        }
        push(object) {
            this.shapes.push(object)
        }
    }
    class Spring {
        constructor(x, y, radius, color, body = 0, length = 1, gravity = 0, width = 1) {
            if (body == 0) {
                this.body = new Circle(x, y, radius, color)
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            } else {
                this.body = body
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            }
            this.gravity = gravity
            this.width = width
        }
        balance() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += (this.body.x - this.anchor.x) / this.length
                this.body.ymom += (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom -= (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom -= (this.body.y - this.anchor.y) / this.length
            } else {
                this.body.xmom -= (this.body.x - this.anchor.x) / this.length
                this.body.ymom -= (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom += (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom += (this.body.y - this.anchor.y) / this.length
            }
            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move() {
            this.anchor.ymom += this.gravity
            this.anchor.move()
        }

    }
    function setUp(canvas_pass, style = "#000000") {
        canvas = canvas_pass
        canvas_context = canvas.getContext('2d');
        canvas.style.background = style
        window.setInterval(function () {
            main()
            fireworks = []
            canvas_context.clearRect(-10000,-10000,canvas.width*20000, canvas.height*20000)
            if(musict == 1){
                // fruitsong.play()
            }else{
            // fruitsong.pause()
            }
    
    
            settingsb.draw()
            if(settings != 1){
                // thestore.draw()
                if(storyp+zenp == 0){
                    storyb.draw()
                    settingsb.draw()
                    zenb.draw()
                }else if(zenp == 1){
                    if(Math.random() < .03){
                        let firework = new Circle(50+(Math.random()*(canvas.width-100)), canvas.height, 5, "white", 7*(Math.random()-.5),-5+(-4*(Math.random())))
                        // fireworks.push(firework)
            
                        fireworks = []
                    }
                    for(let t = 0; t<stars.length; t++){
                        if(stars[t].dot.isPointInside(drone.body)){
                            drone.health-=1*drone.armor
                        }
            
                        if(drone.health <= 0 ){
                            if(drone.dead != 1){
                                timer = 2000
                                drone.dead = 1
                                deathanimationD(drone.body)
                            }
                            drone.rayrange = 1
                            drone.body.radius = 0
                        }
                        fireworks[t].xmom*=.99
                        fireworks[t].ymom*=.99
                        fireworks[t].move()
                        fireworks[t].draw()
                    }
                    for(let t = 0; t<fireworks.length; t++){
                        if(Math.abs(fireworks[t].xmom*fireworks[t].ymom) < 1){
                            deathanimation(fireworks[t])
                            fireworks.splice(t,1)
                        }
                    }
                    drone.body.xmom += (sun.x-drone.body.x)/200
                    drone.body.ymom += (sun.y-drone.body.y)/200
                    drone.move()
                    drone.control()
                    drone.draw()
                    mainguy.draw()
                    canvas_context.fillStyle = "white";
                    canvas_context.font = `${20}px serif`;
                    canvas_context.fillText(` ${score}`, 10,20);
                    // canvas_context.fillStyle = "white";
                    // canvas_context.font = `${20}px serif`;
                    // canvas_context.fillText(` $${money}`, 10,40);
                }else if(storyp == 1){
        
                    if(storyprompt == 0){
        
                        if(Math.random() < .02+(level/100)){
                            let firework = new Circle(50+(Math.random()*(canvas.width-100)), canvas.height, 5, "white", 7*(Math.random()-.5),-5+(-4*(Math.random()-.3)))
                            // fireworks.push(firework)
                        }
                        for(let t = 0; t<fireworks.length; t++){
                            if(fireworks[t].isPointInside(drone.body)){
                                drone.health-=1*drone.armor
                            }
                
                            if(drone.health <= 0 ){
                                if(drone.dead != 1){
                                    drone.dead = 1 
                                     timer = 2000
                                    deathanimationD(drone.body)
                                }
                                drone.rayrange = 1
                                drone.body.radius = 0
                            }
                            fireworks[t].xmom*=.99
                            fireworks[t].ymom*=.99
                            fireworks[t].move()
                            fireworks[t].draw()
                        }
                        for(let t = 0; t<fireworks.length; t++){
                            if(Math.abs(fireworks[t].xmom*fireworks[t].ymom) < 1){
                                deathanimation(fireworks[t])
                                fireworks.splice(t,1)
                            }
                        }
                        drone.body.xmom += (sun.x-drone.body.x)/200
                        drone.body.ymom += (sun.y-drone.body.y)/200
                        drone.move()
                        drone.control()
                        drone.draw()
                        mainguy.draw()
                        canvas_context.fillStyle = "white";
                        canvas_context.font = `${20}px serif`;
                        canvas_context.fillText(` ${score}`, 10,20);
                        canvas_context.fillStyle = "white";
                        canvas_context.font = `${20}px serif`;
                        canvas_context.fillText(` ${Math.round(timer/1000)}`, 640,20);
                        canvas_context.fillStyle = "white";
                        canvas_context.font = `${20}px serif`;
                        canvas_context.fillText(` $${money}`, 10,40);
                        for(let s = 0 ; s<stars.length;s++){
                            if(drone.body.isPointInside(stars[s].dot)){ 
                                drone.health-=1*drone.armor
                            }
                        }
        
                        if(drone.health <= 0 ){
                            if(drone.dead != 1){
                                drone.dead = 1
                                timer = 2000
                                deathanimationD(drone.body)
                            }
                            drone.rayrange = 1
                            drone.body.radius = 0
                        }
        
                    timer-= 18
                    if(timer <= 0){
                        money += (score/100)
                        score = 0
                        money*=100
                        money=Math.round(money)
                        money = money/100
                        level += 1
                        timer = 60000 + (level *10000)
                        storyprompt = 1
                        fireworks = []
                        mainguy.deathrays = []
                    }
                    }else{
                        if(drone.dead == 1){
                            storytext = "Your drone has died, you must repair to continue"
                            drone.dead = 2
                            // drone.dead = 0
                            // drone.radius = 10
                            // drone.rayrange = 400
                        }else{
                            if(drone.dead!=2){
                                switch(level){
        
                                    case 1:
                                      
                                    break
                                    case 2:
                                        storytext = "Good job, you made it through your first gig, Sell the footage and check the shop!"
                                    break
                                    case 3:
                                        storytext = "The Shop now has armor"
                                    break
                                    case 4:
                                        storytext = "The Shop now has speed increase"
                                    break
                                    case 5:
                                        storytext = "Thats all for now, the game just gets harder from now on"
                                    break
        
                                }
                                if(drone.dead == 0){
                                    if(level > 5){
                                        storytext = "Thats all for now, the game just gets harder from now on"
                                    }
                                }
        
                            }
                        }
                        if(instore == 0){
                            zenb.y = 500
                            zenb.draw()
                            storyb.draw()
                            settingsb.draw()
                            canvas_context.fillStyle = "white";
                            canvas_context.font = `${18}px serif`;
                            canvas_context.fillText(` ${storytext}`, 10,350);
                        }else{
        
                            let thism = (100-drone.health)
                            thism*=100
                            thism = Math.round(thism)
                            thism = thism/100
                            thestore.repair.m = "$"+(thism)
                            zenb.y = 600
                            zenb.draw()
                            thestore.draw()
                            canvas_context.fillStyle = "white";
                            canvas_context.font = `${20}px serif`;
                            money*=100
                            money=Math.round(money)
                            money = money/100
                            canvas_context.fillText(` $${money}`, 10,40);
                        }
                    }
        
                 
                    }
            }else{
                musicb.draw()
                turnb.draw()
    
            }
    
        // canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
        canvas_context.fillStyle = "#00000010"
        canvas_context.fillRect(0,0,canvas.width, canvas.height)
        gamepadAPI.update() //checks for button presses/stick movement on the connected controller)
        if(Math.random()<.05){
            let star = new Star(0)
            stars.push(star)
        }
        // game code goes here
        for(let t = 0;t<stars.length;t++){
            stars[t].draw()
        }
        for(let t = 0;t<stars.length;t++){
            stars[t].clean()
        }
        }, 17)
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine
            // example usage: if(object.isPointInside(TIP_engine)){ take action }
            window.addEventListener('pointermove', continued_stimuli);
        });
        window.addEventListener('pointerup', e => {
            window.removeEventListener("pointermove", continued_stimuli);
        })
        function continued_stimuli(e) {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine
        }
    }
    function gamepad_control(object, speed = 1) { // basic control for objects using the controler
        console.log(gamepadAPI.axesStatus[1]*gamepadAPI.axesStatus[0])
        if (typeof object.body != 'undefined') {
            if(typeof (gamepadAPI.axesStatus[1]) != 'undefined'){
                if(typeof (gamepadAPI.axesStatus[0]) != 'undefined'){
                object.body.x += (gamepadAPI.axesStatus[2] * speed)
                object.body.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        } else if (typeof object != 'undefined') {
            if(typeof (gamepadAPI.axesStatus[1]) != 'undefined'){
                if(typeof (gamepadAPI.axesStatus[0]) != 'undefined'){
                object.x += (gamepadAPI.axesStatus[0] * speed)
                object.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        }
    }
    function control(object, speed = 1) { // basic control for objects
        if (typeof object.body != 'undefined') {
            if (keysPressed['w']) {
                object.body.y -= speed
            }
            if (keysPressed['d']) {
                object.body.x += speed
            }
            if (keysPressed['s']) {
                object.body.y += speed
            }
            if (keysPressed['a']) {
                object.body.x -= speed
            }
        } else if (typeof object != 'undefined') {
            if (keysPressed['w']) {
                object.y -= speed
            }
            if (keysPressed['d']) {
                object.x += speed
            }
            if (keysPressed['s']) {
                object.y += speed
            }
            if (keysPressed['a']) {
                object.x -= speed
            }
        }
    }
    function getRandomLightColor() { // random color that will be visible on  black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        return color;
    }
    function getRandomColor() { // random color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 16) + 0)];
        }
        return color;
    }
    function getRandomDarkColor() {// color that will be visible on a black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12))];
        }
        return color;
    }
    function castBetween(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
            let limit = granularity
            let shape_array = []
            for (let t = 0; t < limit; t++) {
                let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
                shape_array.push(circ)
            }
            return (new Shape(shape_array))
    }

    let setup_canvas = document.getElementById('canvas') //getting canvas from document

    setUp(setup_canvas) // setting up canvas refrences, starting timer. 

    // object instantiation and creation happens here 


    class Star{
        constructor(type){
            this.dot = new Circle(Math.random()*canvas.width,0, 2+(Math.random()*3), "transparent", (Math.random()-.5)*3, 1, 1, 1)
            this.activated = Math.floor(Math.random()*100)
            this.string = getRandomColor()
            this.type = type
            this.dots = 0
            if(this.type == 0){
                this.clock = 99
                this.basestr = "ff"
            }else{
                this.clock = 99
                this.basestr = "ff"
            }
        }
        draw(){
            var gard = canvas_context.createRadialGradient(this.dot.x, this.dot.y, this.dot.radius, this.dot.x-(0), this.dot.y-(0), this.dot.radius*8); //-(this.dot.xmom*2)-(this.dot.ymom*2)
            // console.log("hit")
            // this.string = getRandomColor()
            // gard.addColorStop(0,this.string+"ff")
            // gard.addColorStop(0.01,this.string+"88")
            // gard.addColorStop(0.11,this.string+"44")
            // gard.addColorStop(1,this.string+"01")
            if(this.type > 0){
                this.clock-=1.5
                this.basestr = `${Math.round(this.clock)}`
            }

            gard.addColorStop(0,this.string+`ff`)
            gard.addColorStop(0.01,this.string+"61")
            gard.addColorStop(0.41,this.string+"44")
            gard.addColorStop(1,this.string+"01")
            canvas_context.fillStyle = gard;
            this.dot.drawx()
            this.dot.move()
            // this.dot.ymom*=.99
            this.dot.xmom*=1
            // this.dot.ymom-=(this.dot.y-(stars[Math.floor(Math.random()*stars.length)]).dot.y)/1000
            // this.dot.xmom-=(this.dot.x-(stars[Math.floor(Math.random()*stars.length)]).dot.x)/1000
            // this.dot.ymom+=.12
            // if(this.dot.reflected > 0){
                this.activated--
            // }
        }
        clean(){
            if(this.activated<-200){
                if(Math.random()<((10-this.dots)/25)){
                    this.pop()
                }else if(this.type <= 2){
                    this.pop()
                }
                stars.splice(stars.indexOf(this),1)

            }
        }
        pop(){
            let angle = Math.random()*Math.PI*2
            this.pops = 3+Math.floor(Math.random()*9)
            this.dots = this.pops
            if(this.type <2){
                this.type = 3
            }
            this.speed = .5+(Math.random()*3)
            for(let t = 0;t<this.pops ;t++){
                let star = new Star(this.type)
                star.dot.xmom = (Math.cos(angle)*this.speed)
                star.dot.ymom = ((Math.sin(angle)*this.speed))//-3.5
                // star.dot.xmom+=Math.random()-.5
                // star.dot.ymom+=Math.random()-.5
                star.dots = this.dots
                if(Math.random()<.1){
            this.string = getRandomColor()
            // this.string = "#FFA0AF"
                }
            //     if(Math.random()<.15){
            // // this.string = getRandomColor()
            // this.string = "#FF00AF"
            //     }
            //     if(Math.random()<.1){
            // // this.string = getRandomColor()
            // this.string = "#00FF00"
            //     }
                star.string = this.string
                star.dot.radius = this.dot.radius*.95
                star.dot.x = this.dot.x
                star.dot.y = this.dot.y
                star.activated = -150
                star.dot.reflected = 1
                angle+=(Math.PI*2)/this.pops 
                stars.push(star)
            }
        }
    }
    let stars = []

    let starssky = []


    let star = new Star(0)
    stars.push(star)
    function main() {
    }


// window.addEventListener('DOMContentLoaded', (event) =>{

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;

        // flex = canvas.getBoundingClientRect();
        // xs = event.clientX - flex.left;
        // ys = event.clientY - flex.top;
        //   tip.x = xs+xt
        //   tip.y = ys+yt
    
        //   tip.body = tip
    
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];

        //  console.log(event)
        // flex = canvas.getBoundingClientRect();
        // xs = event.clientX - flex.left;
        // ys = event.clientY - flex.top;
        //   tip.x = xs+xt
        //   tip.y = ys+yt
    
        //   tip.body = tip
      });

    // let canvas = document.getElementById("tutorial");
    // let canvas_context = canvas.getContext('2d');

    canvas.style.background = "#000000"



    let flex = canvas.getBoundingClientRect();

    // Add the event listeners for mousedown, mousemove, and mouseup
    let tip = {}
    let xs
    let ys
    let tap = {}
    let xz
    let yz
   
   
    
    window.addEventListener('mousedown', e => {
       flex = canvas.getBoundingClientRect();
   
   
       xs = e.clientX - flex.left;
       ys = e.clientY - flex.top;
         tip.x = xs+xt
         tip.y = ys+yt
   
         tip.body = tip

         if(settingsb.isPointInside(tip)){
            settings *= -1
        }else{
            sun.x = tip.x
            sun.y = tip.y
        }

         if(storyp+zenp == 0){
            if(storyb.isPointInside(tip)){
                storyp = 1
                storyb.y = 500
                zenb.y = 500
                storyb.n = "Store"
                zenb.n = "Go"
            }
            if(zenb.isPointInside(tip)){
                zenp = 1
                zenb.y = 500
                storyb.y = 500
                storyb.n = "Store"
                zenb.n = "Continue"
            }
     

    
         }


         if(settings == 1){
            if(turnb.isPointInside(tip)){

                turn*=-1
                turnt *= -1
                if(turnt == 1){
                    turnb.n = "mouse-turn on"
                    turnb.color ="green"
                 window.addEventListener('mousemove', beamdrag);
                }else{
                        turnb.n = "mouse-turn off"
                        turnb.color ="red"
                    window.removeEventListener("mousemove", beamdrag);
                    window.removeEventListener("mousehold", beamdrag);
                }
            }
            if(musicb.isPointInside(tip)){
                musict *= -1
                if(musict == 1){
                    musicb.n = "music on"
                    musicb.color ="green"
                 window.addEventListener('mousemove', beamdrag);
                }else{
                    musicb.n = "music off"
                    musicb.color ="red"
                    window.removeEventListener("mousemove", beamdrag);
                    window.removeEventListener("mousehold", beamdrag);
                }
            
            }
         }




         if(instore == 1){
             if(thestore.repair.isPointInside(tip)){
                if(money >= (100-drone.health)){
                    money-=(100-drone.health)
                    drone.health = 100
                    drone.dead = 0
                    drone.body.radius = 5
                    drone.rayrange = raystore
                    money*=100
                    money=Math.round(money)
                    money = money/100
                }else{
                    drone.health += money 
                    drone.dead = 0
                    drone.body.radius = 5
                    drone.rayrange = raystore
                    money = 0
                    money*=100
                    money=Math.round(money)
                    money = money/100
                }

             }
            for(let t = 0; t<Math.min((2+level), 9); t++){
                if(thestore.buttons[t].isPointInside(tip)){
                    switch(t){
                        case 0:
                            thestore.buy0()
                        break
                        case 1:
                            thestore.buy1()
                        break
                        case 2:
                            thestore.buy2()
                        break
                        case 3:
                            thestore.buy3()
                        break
                        case 4:
                            thestore.buy4()
                        break
                        // case 5:
                        //     thestore.buy5()
                        // break
                        // case 6:
                        //     thestore.buy6()
                        // break
                        // case 7:
                        //     thestore.buy7()
                        // break
                        // case 8:
                        //     thestore.buy8()
                        // break
                        // case 9:
                        //     thestore.buy9()
                        // break
                    }
                }
            }
         }
   
         if(storyprompt == 1){
            if(storyb.isPointInside(tip)){
                instore = 1
            }
            if(zenb.isPointInside(tip)){
                if(drone.health > 0){
                    storyprompt = 0
                    instore = 0
                    sun.x=350
                    sun.y = 20
                }
            }
        }


    //    if(mainguy.health ==0){
    //        if(squarecircle(restart, tip)){
    //            enemies = []
    //            score = 0
    //            mainguy.body.x = 350
    //            mainguy.body.y = 350
    //            mainguy.shots = []
    //            mainguy.deathrays = []
    //            mainguy.health = 1
    //            enemyspawn = 0.009
    //        }
    //    }
   
       //   mainguy.firing+= 1
       //   mainguy.gun.fire(tip)

   
         mouse = true
   
    //   window.addEventListener('mousemove', beamdrag);
    });
   
   
   
    window.addEventListener('mouseup', e => {
        // snowfreak =0
        mouse = false
    //    window.removeEventListener("mousemove", beamdrag);
    //    window.removeEventListener("mousehold", beamdrag);
    })
   
   function beamdrag(e) {
       flex = canvas.getBoundingClientRect();
   
   
       xs = e.clientX - flex.left;
       ys = e.clientY - flex.top;
       tip.x = xs+xt
       tip.y = ys+yt
         tip.body = tip


          angleRadians = Math.atan2(tip.y - drone.body.y, tip.x - drone.body.x);

          drone.globalangle = (angleRadians-drone.gapangle*1.5)+Math.PI
   
        //   console.log("what")
        //  mainguy.firing+= 1
        //  mainguy.gun.fire(tip)
     }

     
    class Enemy{
        constructor(){
            this.body = new Circle(Math.random()*canvas.width, Math.random()*canvas.height, 14, "red")
            this.health = 40
            // this.gun = mainguy.gun
            this.shots =  []
            this.firing = 0
            this.gun = new Gun(this)
        }
        draw(){
            this.body.draw()
            
        }
    }

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
        }
        draw(){
            canvas_context.strokeStyle = this.color
            canvas_context.stokeWidth = 3
            canvas_context.moveTo(this.x, this.y)
            canvas_context.lineTo(this.x1, this.y)
            canvas_context.lineTo(this.x, this.tip)
            canvas_context.lineTo(this.x2, this.y)
            canvas_context.lineTo(this.x, this.y)
            canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }


    class RectangleL {
        constructor(x, y, height, width, color, text ="") {
            this.n = text
            this.m = ""
            // numcount++
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            canvas_context.fillStyle = this.color
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
            canvas_context.fillStyle = "black";
            canvas_context.font = `${this.height/1.3}px serif`;
            canvas_context.fillText(`${this.n}`, this.x+(.1*this.width), this.y+(.82*this.height));
            canvas_context.fillStyle = "white";
            canvas_context.fillText(`${this.m}`, this.x+(.3*this.width), this.y+(2.82*this.height));
        }
        move(){

            this.x+=this.xmom
            this.y+=this.ymom

        }

        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }



    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            canvas_context.fillStyle = this.color
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        angle() {
            this.object = {}
            this.target = {}
            this.object.x = this.x1
            this.object.y = this.y2
            this.target.x = 0
            this.target.y = 0
            return Math.atan2(this.target.y - this.object.y, this.target.x - this.object.x)
        }
        hypotenuse(){
            let xdif = this.x1-this.x2
            let ydif = this.y1-this.y2
            let hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.x1, this.y1)         
            canvas_context.lineTo(this.x2, this.y2)
            canvas_context.stroke()
            canvas_context.lineWidth = 1
        }
    }

 
    class Gun{
        constructor(owner){
          this.rate = 25
          this.owner = owner
          this.bulletsize =3
          this.bulletspeed = 5
          this.range = 120
        }
        fire(tip){
        //   snowfreak+= .01
        if(this.owner.firing%this.rate == 0){
              this.owner.shots[ this.owner.shots.length] = new Circle(this.owner.body.x,this.owner.body.y, this.bulletsize, "white") // make the bullet
              this.owner.shots[this.owner.shots.length-1].health = this.range  //This controlls how far the bullet will go
              //trajectory calculation
              let s = Math.abs(this.owner.body.x - tip.x)
              let b = Math.abs(this.owner.body.y - tip.y)
              for (let k = 0; Math.sqrt(Math.abs(b*b)+Math.abs(s*s)) > this.bulletspeed; k++ ){   //sets speed to maximum from above
              b = b*.9999
              s = s*.9999
              }
              for (let k = 0;Math.sqrt(Math.abs(b*b)+Math.abs(s*s)) < this.bulletspeed; k++ ){ //sets speed to maximum from below
              b = b/.9999
              s = s/.9999
              }  
              //section to determine direction
              if(tip.x > this.owner.body.x){
              this.owner.shots[ this.owner.shots.length-1].xmom = s
              }
              if(tip.x < this.owner.body.x){
              this.owner.shots[ this.owner.shots.length-1].xmom = -s
              }
              if(tip.y< this.owner.body.y){
                  this.owner.shots[ this.owner.shots.length-1].ymom = -b
              }
              if(tip.y> this.owner.body.y){
                  this.owner.shots[ this.owner.shots.length-1].ymom = b
              }
              this.owner.shots[ this.owner.shots.length-1].xmom+=3.1
            }
        }
    }


    class Blocktangle{
        constructor(x, y, height, width, color) {
            this.body = new Rectangle(x,y,width,height, color)
            this.blocks = []
            for(let g = 0; g<this.body.width; g+=5){   
                for(let h = 0; h<this.body.height; h+=5){   
                        let block = new Rectangle(x+(g),y+(h),5,5, color)
                        this.blocks.push(block)
                        // g+=5
                }
                // h+=5
            }
        }
        draw(){
            for(let g = 0; g<this.blocks.length; g++){
                this.blocks[g].draw()
            }
        }

    }

  class Ship{
    constructor(){
        this.body = new Circle(100,350, 3, "cyan")
        this.shots = []
        this.firing = 0
        this.deathrays = []
        this.health = 1
        this.gun = new Gun(this)
    }

    film(){
            if(typeof (gamepadAPI.axesStatus[2]) != 'undefined'){
                if(typeof (gamepadAPI.axesStatus[3]) != 'undefined'){
                    
            if(Math.abs(parseFloat(gamepadAPI.axesStatus[2]) + Math.abs(parseFloat(gamepadAPI.axesStatus[3]))) > 0){
            let link = new Line( parseFloat(gamepadAPI.axesStatus[2]),0, 0, parseFloat(gamepadAPI.axesStatus[3]), "transparent", 0)
            // let mass = drone.globalangle
            drone.globalangle = link.angle()
            }
                }
            }
    }
    draw(){
        this.film()

        gamepad_control(sun, 5)
        this.body.draw()
      

        // this.body.ymom += gravity*3
 
        for(let x = 0 ; x<floors.length;x++){
            this.body.y+=this.body.radius
            if(floors[x].isPointInside(this.body)){
                if(this.body.ymom > 0){
                    this.body.ymom = 0
                }
            }
            this.body.y-=this.body.radius
        }


        for(let s = 0 ; s<this.shots.length;s++){
            // this.shots[s].ymom +=.5
            this.shots[s].move()
          this.shots[s].draw()
          // deathanimation(this.shots[s])
          this.shots[s].health-=1
        }
        for(let s = 0 ; s<this.deathrays.length;s++){
            // if(drone.body.isPointInside(this.deathrays[s])){
            //     deathanimation(drone.body)
            //     drone.rayrange = 0
            //     drone.body.radius = 0
            //     console.log("j")
            // }

            // this.deathrays[s].ymom+=.01
          this.deathrays[s].move()
          this.deathrays[s].draw()
          this.deathrays[s].radius *= .9
        }
        for(let s = 0 ; s<this.deathrays.length;s++){
            if(this.deathrays[s].radius < .4){
                if(this.deathrays[s].layer == 1){
                    deathanimationM(this.deathrays[s])
                }else if( this.deathrays[s].layer == 2){

                    // deathanimationM(this.deathrays[s])
                //   deathanimationy(this.deathrays[s])
                }else if( this.deathrays[s].layer == 3){

                    // deathanimationM(this.deathrays[s])
                //   deathanimationz(this.deathrays[s])
                }else if( this.deathrays[s].layer == 4){

                    // deathanimationM(this.deathrays[s])
                //   deathanimationw(this.deathrays[s])
                }
              //   this.deathrays.splice(s,Math.ceil(1+snowfreak))
            //   if(Math.random() < .9){
                this.deathrays.splice(s,1)
            //   }
            }
        }
          for(let s = 0 ; s<this.shots.length;s++){
  
  
            for(let e = 0; e<enemies.length; e++){
                if(intersects(enemies[e].body,this.shots[s])){
                    enemies[e].health -= (this.shots[s].radius)*(this.gun.bulletspeed)
                    enemies[e].body.xmom += this.shots[s].xmom/3
                    enemies[e].body.ymom += this.shots[s].ymom/3
                    deathanimation(this.shots[s])
                    this.shots.splice(s,1)
                }
              }
          }
        for(let s = 0 ; s<this.shots.length;s++){
            if(this.shots[s].health <= 0){
              deathanimation(this.shots[s])
                this.shots.splice(s,1)
            }
        }
    }
    move(){
        
        this.body.move()
    }
}

class Store{
    constructor(){
        this.repair =  new RectangleL(0, 640, 20, 120, "#00FF00", "repair")
        this.buttons = []
        let xt = 95
        let yt = 95
        for(let k = 0; k<9; k++){

            let button = new RectangleL(xt, yt, 20, 120, "#00FF00", "hi")
            if(k == 0){
                button.n = "Resolution +"
                button.m = "$75"
            }
            if(k == 1){
                button.n = "View Range +"
                button.m = "$100"
            }
            if(k == 2){
                button.n = "View angle +"
                button.m = "$200"
            }
            if(k == 3){
                button.n = "Armor +"
                button.m = "$100"
            }
            if(k == 4){
                button.n = "Speed +"
                button.m = "$100"
            }
            if(k>4){
                button.m = "pending"
            }
            this.buttons.push(button)
            xt+=170
            if(k%3 == 2){
                yt += 170
                xt = 95
            }
        }
        
    }
    buy0(){
        if(money >= 75){
            drone.raymake+=2
            money-=75
            money*=100
            money=Math.round(money)
            money = money/100
        }
    }
    buy1(){
        if(money >= 100){
            drone.rayrange = raystore
            drone.rayrange+=10
            raystore = drone.rayrange
            money-=100
            money*=100
            money=Math.round(money)
            money = money/100
        }
    }
    buy2(){
        if(money >= 200){
            drone.gapangle+=.05
            if(drone.gapangle > Math.PI){
                drone.gapangle = Math.PI
            }
            money-=200
            money*=100
            money=Math.round(money)
            money = money/100
        }
    }
    buy3(){
        if(money >= 100){
            drone.armor-=.2
            if(drone.armor <=0){
                drone.armor = 0
            }
            money-=100
            money*=100
            money=Math.round(money)
            money = money/100
        }
    }
    buy4(){
        if(money >= 100){
            drone.speed+=.05
            money-=100
            money*=100
            money=Math.round(money)
            money = money/100
        }
    }
    draw(){
        this.repair.draw()
        for(let t = 0; t<Math.min((1+level), 9); t++){
            this.buttons[t].draw()
        }
    }

}

class Observer{
    constructor(){
        this.speed = 3
        this.armor = 5
        this.healthbars = new Rectangle(630,30,8,60,"white")
        this.healthbar =new Rectangle(630,30,8,60,"green")
        this.health=100
        this.maxhealth = 100
        this.body = new Circle( 500, 500, 5, "white")
        this.ray = []
        this.rayrange = raystore
        this.globalangle = 0
        this.gapangle = Math.PI/12
        this.currentangle = 0
        this.obstacles = []
        this.raymake = 80
        this.rotomass = .05
        // this.edges = []
        this.edge1 = new Circle(0,0,5,"red")
        this.edge2 = new Circle(0,0,5,"red")
        this.edge3 = new Circle(0,0,5,"red")
    }
    move(){
        this.body.xmom*= .9
        this.body.ymom*= .9
        this.body.move()
    }

    beam(){
        this.currentangle  = this.gapangle/2
        for(let k = 0; k<this.raymake; k++){
            this.currentangle+=(this.gapangle/Math.ceil(this.raymake/2))
            let ray = new Circle(this.body.x, this.body.y, 5, "white",-((this.rayrange * (Math.cos(this.globalangle+this.currentangle))))/this.rayrange*3, - ((this.rayrange * (Math.sin(this.globalangle+this.currentangle))))/this.rayrange*3 )
            ray.collided = 0
            ray.lifespan = this.rayrange-1
            this.ray.push(ray)
        }
        this.obstacles = [...mainguy.deathrays, ... fireworks]
        for(let t = 0;t<stars.length;t++){
            this.obstacles.push(stars[t].dot)
        }

        // console.log(this.obstacles.length)
        let bubble = new Circle(this.body.x, this.body.y, this.rayrange, "yellow")
        // for(let t = 0; t< this.obstacles.length; t++){
        //     if(!bubble.isPointInside(this.obstacles[t])){
                // bubble.draw()
                // this.obstacles.splice(t,1)


        let xoutl = 0
        let youtl = 0

        let xouth = 0
        let youth = 0



        this.edge1.y = ((this.rayrange+10)*(Math.sin(this.globalangle+this.gapangle/2)))+this.body.y
        this.edge1.x = ((this.rayrange+10)*(Math.cos(this.globalangle+this.gapangle/2)))+this.body.x
        this.edge2.y = ((this.rayrange+10)*(Math.sin(this.globalangle+this.gapangle*2.5)))+this.body.y
        this.edge2.x = ((this.rayrange+10)*(Math.cos(this.globalangle+this.gapangle*2.5)))+this.body.x
        this.edge3.y = ((this.rayrange+10)*(Math.sin(this.globalangle+this.gapangle*1.5)))+this.body.y
        this.edge3.x = ((this.rayrange+10)*(Math.cos(this.globalangle+this.gapangle*1.5)))+this.body.x

        // this.edge1.draw()

        // this.edge2.draw()

        // this.edge3.draw()


            if(((-this.edge1.x)+this.body.x) > (xouth)){
              xouth  = -  this.edge1.x+this.body.x 
            }
            if(((-this.edge1.y)+this.body.y) > (youth)){
                youth = (-this.edge1.y)+this.body.y
            }
            if(((-this.edge1.x)+this.body.x) < (xoutl)){
              xoutl  = (-this.edge1.x)+this.body.x 
            }
            if(((-this.edge1.y)+this.body.y) < (youtl)){
                youtl = (-this.edge1.y)+this.body.y
            }
        


            if(((-this.edge2.x)+this.body.x) > (xouth)){
                xouth  = (-this.edge2.x)+this.body.x 
              }
              if(((-this.edge2.y)+this.body.y) > (youth)){
                  youth = (-this.edge2.y)+this.body.y
              }
              if(((-this.edge2.x)+this.body.x) < (xoutl)){
                xoutl  = (-this.edge2.x)+this.body.x 
              }
              if(((-this.edge2.y)+this.body.y) < (youtl)){
                  youtl = (-this.edge2.y)+this.body.y
              }


              if(((-this.edge3.x)+this.body.x) > (xouth)){
                xouth  = (-this.edge3.x)+this.body.x 
              }
              if(((-this.edge3.y)+this.body.y) > (youth)){
                  youth = (-this.edge3.y)+this.body.y
              }
              if(((-this.edge3.x)+this.body.x) < (xoutl)){
                xoutl  = (-this.edge3.x)+this.body.x 
              }
              if(((-this.edge3.y)+this.body.y) < (youtl)){
                  youtl = (-this.edge3.y)+this.body.y
              }
        
            let bounds = new Rectangle(this.body.x+xoutl, this.body.y+youtl, youth+(Math.abs(youtl)),xouth+(Math.abs(xoutl)),"cyan")

        // bounds.draw()


        if(this.gapangle < Math.PI/4){
            this.obstacles = this.obstacles.filter(obstacle => bounds.isPointInside(obstacle));
        }else{
            this.obstacles = this.obstacles.filter(obstacle => bubble.isPointInside(obstacle));
        }

                // console.log(t)
        //     }
        // }
        // console.log(this.obstacles.length)



        for(let f = 1; f<this.rayrange/3; f++){
            for(let t = 0; t<this.ray.length; t++){
                if(this.ray[t].collided < 1){
                    this.ray[t].move()
                for(let q = 0; q<this.obstacles.length; q++){
                    if(this.obstacles[q].isPointInside(this.ray[t])){
                        this.ray[t].collided = 1
                        this.ray[t].xmom = 0
                        this.ray[t].ymom = 0
                        score+=((this.rayrange/20)/((f+25)/2.5))
                    }
                  }
                }
            }
        }

        this.obstacles = []
        score = Math.round(score)
    }

    draw(){

        if(zenp == 0){

            canvas_context.lineWidth = 2
            canvas_context.strokeStyle = "cyan"
            canvas_context.strokeRect(this.healthbars.x, this.healthbars.y, this.healthbars.width, this.healthbars.height)
    
            if(this.health<0){
                this.health = 0
            }
            this.healthbar.width = (this.health/this.maxhealth)*this.healthbars.width
            this.healthbar.draw()
        }

        // this.globalangle+=.01
        this.beam()
        this.body.draw()
        canvas_context.lineWidth = .09
        canvas_context.fillStyle = "white"
        canvas_context.strokeStyle = "white"
        canvas_context.beginPath()
        canvas_context.moveTo(this.body.x, this.body.y)
        for(let y = 0; y<this.ray.length; y++){
                canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                    // canvas_context.lineTo(this.body.x, this.body.y)
            }
        // canvas_context.stroke()

        var gard = canvas_context.createRadialGradient(this.body.x, this.body.y, 0, this.body.x-(0), this.body.y-(0), this.rayrange)
            this.string = "#FFFFFF"
        gard.addColorStop(0,this.string+`ff`)
        gard.addColorStop(0.01,this.string+"61")
        gard.addColorStop(0.41,this.string+"44")
        gard.addColorStop(1,this.string+"01")
        canvas_context.fillStyle = gard
        canvas_context.fill()
        this.ray =[]
    }

    control(){
        if(keysPressed['q'] || keysPressed['i']){
            this.globalangle += this.rotomass
            this.rotomass*= 1.05
        }else{

        this.rotomass*= .96
        if(this.rotomass < .08){
            this.rotomass = .08
        }
        }
        if(keysPressed['e'] || keysPressed['p']){
            this.globalangle -=  this.rotomass
            this.rotomass*= 1.05
        }else{

        this.rotomass*= .96
        if(this.rotomass < .08){
            this.rotomass = .08
        }
        }
        if(keysPressed['w']){
            sun.y-=this.speed
            this.body.y-=this.speed
            if(turn == 1){

                angleRadians = Math.atan2(tip.y - drone.body.y, tip.x - drone.body.x);
  
                drone.globalangle = (angleRadians-drone.gapangle*1.5)+Math.PI

            }
        }
        if(keysPressed['d']){
            sun.x+=this.speed
            this.body.x+=this.speed

            if(turn == 1){

                angleRadians = Math.atan2(tip.y - drone.body.y, tip.x - drone.body.x);
  
                drone.globalangle = (angleRadians-drone.gapangle*1.5)+Math.PI

            }
        }
        if(keysPressed['s']){
            sun.y+=this.speed
            this.body.y+=this.speed
            if(turn == 1){

                angleRadians = Math.atan2(tip.y - drone.body.y, tip.x - drone.body.x);
  
                drone.globalangle = (angleRadians-drone.gapangle*1.5)+Math.PI

            }
        }
        if(keysPressed['a']){
            sun.x-=this.speed
            this.body.x-=this.speed
            if(turn == 1){

                angleRadians = Math.atan2(tip.y - drone.body.y, tip.x - drone.body.x);
  
                drone.globalangle = (angleRadians-drone.gapangle*1.5)+Math.PI

            }
        }

    }
}






  let mainguy = new Ship()

  let z = 0
  let tx = 0
//   for(let t = 1; t< 4200; t++){

//     z++
//     let floor = new Rectangle(400+tx,z*5,5,5, "blue")
//     if((t)%140 == 0){
//         console.log("hit")
//         tx+=5
//         z = 0
//     }

    // floors.push(floor)
  
    


//   }

let roof = new Rectangle(-100, -600, 700, 100000, "blue")

let floor = new Rectangle(-100, 600, 700, 100000, "blue")

//   let blocker = new Blocktangle(350,350, 100,100, "green")

// //   blocktangles.push(blocker)
   
//   let blocker2 = new Blocktangle(100,100, 100,100, "blue")

//   for(let t = 0; t<200; t++){
//       let blocang =  new Blocktangle(400+(Math.random()*60000),Math.random()*300, 20+(Math.floor(Math.random()*10)*5),100+(Math.floor(Math.random()*100)*5), "blue")

// //   blocktangles.push(blocang)
   
//   }

  let drone = new Observer()



//   blocktangles.push(blocker2)

let sun = new Circle(350,350,0,"red")
   

    function players(racer){
        if (keysPressed['w']) {
            // if(racer.y>0){
                racer.y -= 5
                canvas_context.translate(0,5)
                yt-=5
                tip.y-=5
                // updateTip()
            // }
        }
        // if (keysPressed['a']) {
        //     // if(racer.x>0){
        //         racer.x -= 2
        //         canvas_context.translate(2,0)
        //         xt-=2
        //         tip.x-=2
        //         // updateTip()
        //     // }
        // }
        if (keysPressed['s']) {
            // if(racer.y<canvas.height){
                racer.y += 5
            canvas_context.translate(0,-5)
            yt+=5

            tip.y+=5
            // updateTip()
            // }
        }
        // if (keysPressed['d']) {
        //     // if(racer.x<canvas.width){
        //         racer.x += 2
        //         canvas_context.translate(-2,0)
        //         xt+=2
        //         tip.x+=2
        //         // updateTip()
        //     // }
        // }
        if (keysPressed['f']) {
            mainguy.gun.bulletspeed += .1
            if(mainguy.gun.bulletspeed>10){
                mainguy.gun.bulletspeed = 10
            }
        }
        if (keysPressed['g']) {
            mainguy.gun.bulletsize += .1
            if(mainguy.gun.bulletsize>10){
                mainguy.gun.bulletsize = 10
            }
        }
        if (keysPressed['h']) {
            mainguy.gun.rate -= 1
            if(mainguy.gun.rate<10){
                mainguy.gun.rate = 10
            }
        }
        if (keysPressed['v']) {
            mainguy.deathrays = []
        }


        // any key combination can be made from a nested if statement, all keys can just be accessed by name (if you can find it)

    }




    function deathanimation(body){

        // start+=.005
        // start+=.02
        //  start = Math.random()
    
    
        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*7)+2
    
                
            
            
         
            // deathrays =4//1+snowfreak
    
    
    
        for(let g = 0; g < deathrays; g++){
    
            let dot1 
            dot1 = new Circle(body.x, body.y, body.radius, getRandomLightColor(), Math.cos(rotx)*1, Math.sin(roty)*1 )
            if(Math.random()<.5){
                dot1 = new Circle(body.x, body.y, body.radius, getRandomLightColor(), Math.cos(rotx)*1, Math.sin(roty)*1 )
            }
            if(Math.random()<.1){
                dot1 = new Circle(body.x, body.y, body.radius, getRandomLightColor(), Math.cos(rotx)*1, Math.sin(roty)*1 )
            }
        
            // for(let x = 0 ; x<floors.length;x++){
            //   if(floors[x].isPointInside(dot1)){
            //       if(dot1.ymom > 0){
            //         // dot1.ymom*=-1
            //       }
            //   }
            //  }
            // dot1.move()
            // for(let x = 0 ; x<floors.length;x++){
            //     if(floors[x].isPointInside(dot1)){
            //         if(dot1.ymom > 0){
            //         //   dot1.ymom*=-2
            //         }
            //     }
            //    }
            // dot1.move()
            // for(let x = 0 ; x<floors.length;x++){
            //     if(floors[x].isPointInside(dot1)){
            //         if(dot1.ymom > 0){
            //         //   dot1.ymom*=-2
            //         }
            //     }
            //    }
            // dot1.move()
            // for(let x = 0 ; x<floors.length;x++){
            //     if(floors[x].isPointInside(dot1)){
            //         if(dot1.ymom > 0){
            //         //   dot1.ymom*=-2
            //         }
            //     }
            //    }
            dot1.ring = 1
            dot1.layer = 1
            mainguy.deathrays.push(dot1)
    
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    
        // // start+=.05
        // //  start = Math.random()
    
    
        // let rotx = start
        // let roty = start
    
        // let deathrays = Math.floor(Math.random()*10)+10
    
            
            
         
        //     deathrays =50//1+snowfreak
    
    
    
        // for(let g = 0; g < deathrays; g++){
    
    
        //     let dot1 = new Circle(body.x, body.y, body.radius/100, "white", Math.cos(rotx)*1, Math.sin(roty)*1)
        //     // for(let x = 0 ; x<floors.length;x++){
        //     //     if(floors[x].isPointInside(dot1)){
        //     //         if(dot1.ymom > 0){
        //     //           dot1.ymom*=-2
        //     //         }
        //     //     }
        //     //    }
        //     // dot1.move()
        //     // // for(let x = 0 ; x<floors.length;x++){
        //     // //     if(floors[x].isPointInside(dot1)){
        //     // //         if(dot1.ymom > 0){
        //     // //           dot1.ymom*=-2
        //     // //         }
        //     // //     }
        //     // //    }
        //     // dot1.move()
        //     // // for(let x = 0 ; x<floors.length;x++){
        //     // //     if(floors[x].isPointInside(dot1)){
        //     // //         if(dot1.ymom > 0){
        //     // //           dot1.ymom*=-2
        //     // //         }
        //     // //     }
        //     // //    }
        //     // dot1.move()
        //     // for(let x = 0 ; x<floors.length;x++){
        //     //     if(floors[x].isPointInside(dot1)){
        //     //         if(dot1.ymom > 0){
        //     //           dot1.ymom*=-2
        //     //         }
        //     //     }
        //     //    }
        //     dot1.ring = 1
        //     dot1.layer =1
        //     mainguy.deathrays.push(dot1)
    
        //     rotx += 2*Math.PI/deathrays
        //     roty += 2*Math.PI/deathrays
        // }
    
    }
    
    
    
    function deathanimationx(body){
    
        // start+=.005
        // start+=.02
        //  start = Math.random()
    
    
        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*10)+10
    
                
            
            
         
            deathrays =20//1+snowfreak
    
    
    
        for(let g = 0; g < deathrays; g++){
    
            let dot1 
            dot1 = new Circle(body.x, body.y, body.radius*2, body.color, Math.cos(rotx)*2, Math.sin(roty)*2 )
    
            if(Math.random()<.1){
                dot1 = new Circle(body.x, body.y, body.radius*2, getRandomLightColor(), Math.cos(rotx)*2, Math.sin(roty)*2 )
            }
        
            // for(let x = 0 ; x<floors.length;x++){
            //   if(floors[x].isPointInside(dot1)){
            //       if(dot1.ymom > 0){
            //         // dot1.ymom*=-1
            //       }
            //   }
            //  }
            // dot1.move()
            // for(let x = 0 ; x<floors.length;x++){
            //     if(floors[x].isPointInside(dot1)){
            //         if(dot1.ymom > 0){
            //         //   dot1.ymom*=-2
            //         }
            //     }
            //    }
            // dot1.move()
            // for(let x = 0 ; x<floors.length;x++){
            //     if(floors[x].isPointInside(dot1)){
            //         if(dot1.ymom > 0){
            //         //   dot1.ymom*=-2
            //         }
            //     }
            //    }
            // dot1.move()
            // for(let x = 0 ; x<floors.length;x++){
            //     if(floors[x].isPointInside(dot1)){
            //         if(dot1.ymom > 0){
            //         //   dot1.ymom*=-2
            //         }
            //     }
            //    }
            dot1.ring = 1
            dot1.layer = 2
            mainguy.deathrays.push(dot1)
    
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    
    }
    function deathanimationM(body){
    
        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*7)+2

            // deathrays =3
        for(let g = 0; g < deathrays; g++){
    
            let dot1 

            dot1 = new Circle(body.x, body.y, body.radius*14, body.color, Math.cos(rotx)*2, Math.sin(roty)*2 )
    
            if(Math.random()<.1){
                dot1 = new Circle(body.x, body.y, body.radius*14, getRandomLightColor(), Math.cos(rotx)*2, Math.sin(roty)*2 )
            }
        
            dot1.ring = 1
            dot1.layer+=1
            mainguy.deathrays.push(dot1)
    
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    
    }
    
    function deathanimationD(body){
    
        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*10)+30

            // deathrays =3
        for(let g = 0; g < deathrays; g++){
    
            let dot1 

            dot1 = new Circle(body.x, body.y, body.radius*14, body.color, Math.cos(rotx)*2, Math.sin(roty)*2 )
    
        
            dot1.ring = 1
            dot1.layer+=1
            mainguy.deathrays.push(dot1)
    
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    
    }
    
    function deathanimationy(body){
    
        // start+=.005
        // start+=.02
        //  start = Math.random()
    
    
        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*10)+10
    
                
            
            
         
            deathrays =3//1+snowfreak
    
    
    
        for(let g = 0; g < deathrays; g++){
    
    
            let dot1 = new Circle(body.x, body.y, body.radius*3, "#AADDFF", Math.cos(rotx)*2, Math.sin(roty)*2 )
            dot1.move()
            dot1.move()
            dot1.move()
            dot1.ring = 1
            dot1.layer = 3
            mainguy.deathrays.push(dot1)
    
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    
    }
    
    function deathanimationz(body){
    
        // start+=.005
        // start+=.02
        //  start = Math.random()
    
    
        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*10)+10
    
                
            
            
         
            deathrays =3//1+snowfreak
    
    
    
        for(let g = 0; g < deathrays; g++){
    
    
            let dot1 = new Circle(body.x, body.y, body.radius*3, "orange", Math.cos(rotx)*3, Math.sin(roty)*3 )
            dot1.move()
            dot1.move()
            dot1.move()
            dot1.ring = 1
            dot1.layer = 4
            mainguy.deathrays.push(dot1)
    
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    
    }
    
    function deathanimationw(body){
    
        // start+=.005
        // start+=.02
        //  start = Math.random()
    
    
        let rotx = start
        let roty = start
    
        let deathrays = Math.floor(Math.random()*10)+10
    
                
            
            
         
            deathrays =3//1+snowfreak
    
    
        for(let g = 0; g < deathrays; g++){
    
    
            let dot1 = new Circle(body.x, body.y, body.radius*3, "red", Math.cos(rotx)*3, Math.sin(roty)*3 )
            dot1.move()
            dot1.move()
            dot1.move()
            dot1.ring = 1
            dot1.layer = 5
            mainguy.deathrays.push(dot1)
    
            rotx += 2*Math.PI/deathrays
            roty += 2*Math.PI/deathrays
        }
    
    }
    function getRandomLightColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[(Math.floor(Math.random() * 15)+1)];
        }
        return color;
      }
    
      function updateTip(event){
        flex = canvas.getBoundingClientRect();
        xs = e.clientX - flex.left;
        ys = e.clientY - flex.top;
          tip.x = xs+xt
          tip.y = ys+yt
    
          tip.body = tip
    
      }

      let fireworks = []

      mainguy.body.x = -1000

      let settingsb = new RectangleL(1240, 5, 30, 30, "red",geartext)
      let musicb = new RectangleL(100, 350, 30, 100, "red",`music off`)
      let storyb = new RectangleL(200, 350, 30, 100, "red",`Story`)
      let turnb = new RectangleL(350, 350, 30, 165, "red",`mouse-turn off`)
      let zenb = new RectangleL(800, 350, 30, 70, "red","Zen")


      let thestore = new Store


})