//declare variables
var back_ground, back_ground_image;
var shuttle, shuttle_image;
var asteroid, asteroid_image, asteroids_group;
var laser, laser_image, lasers_group;
var gameover, gameover_image;
var restart, restart_image;

var score = 0;

var game_state, STORY = -1, PLAY = 1, END = 0;

function preload() {
  	//load images
  	back_ground_image = loadImage("background.jpeg");
  	shuttle_image = loadImage("shuttle.png");
  	asteroid_image = loadImage("asteroid.png");
  	laser_image = loadImage("laser.png");
  	gameover_image = loadImage("gameover.jpg");
  	restart_image = loadImage("restart.png");
}

function setup() {
	createCanvas(500,500);

	game_state = STORY;

	//set up background
	back_ground = createSprite(250,250,500,500);
	back_ground.addImage(back_ground_image);
	back_ground.scale = 1.2;

	//set up shuttle
	shuttle = createSprite(50,250,10,10);
	shuttle.addImage(shuttle_image);
	shuttle.scale = 0.1

	//create groups for asteroids and lasers
	asteroids_group = new Group();
	lasers_group = new Group();

	//create the game over screen and make it invisible
	gameover = createSprite(250,250,500,500);
	gameover.addImage(gameover_image);
	gameover.visible = false;

	//create the restart button and make it invisible
	restart = createSprite(250,400,10,10);
	restart.addImage(restart_image);
	restart.scale = 0.25;
	restart.visible = false;
}

function draw() {

	//instructions
	if (game_state === STORY) {

		background(back_ground_image);
		//make the shuttle and background invisible
		shuttle.visible = false;
		back_ground.visible = false;

		display_story();

		//move to the instructions
		if (keyDown("enter")) {
			game_state = PLAY;
		}
	}


	//when the game is played:
	if (game_state === PLAY) {

		//set the position of the camera
		camera.position.x = shuttle.x + 200;
		camera.position.y = 250;

		//make the shuttle and background visible
		shuttle.visible = true;
		back_ground.visible = true;

		//infinite scrolling
		//back_ground.velocityX = -5;
		if (back_ground.x < camera.position.x-75) {
			back_ground.x = camera.position.x+75;
		}
		shuttle.velocityX = 5;
		

		//shuttle motion
		if (keyDown(UP_ARROW)) {
			shuttle.y = shuttle.y - 5;
		}
		if (keyDown(DOWN_ARROW)) {
			shuttle.y = shuttle.y + 5;
		}

		//create asteroids every 100 frames
		if (frameCount % 100 === 0) {
			spawn_asteroid();
		}

		//shoot lasters when space key is pressed
		if (keyDown("space")) {
			spawn_laser();
		}

		//destory the asteroid when a laser touches it
		if (lasers_group.isTouching(asteroids_group)) {
			asteroid.destroy();
			lasers_group.destroyEach();
			score = score + 1;
		}

		//end the game when you crash into an asteroid
		if (asteroids_group.isTouching(shuttle)) {
			asteroids_group.destroyEach();
			lasers_group.destroyEach();
			game_state = END;
		}

	}

	//after the game ends:
	else if (game_state === END) {

		//stop moving the background
		//back_ground.velocityX = 0;
		shuttle.velocityX = 0;

		//stop the asteroids and lasers
		asteroids_group.setVelocityXEach(0);
		asteroids_group.setLifetimeEach(-1);
		lasers_group.setVelocityEach(0);
		lasers_group.setLifetimeEach(-1);

		//display the game over screen and restart button
		gameover.visible = true;
		gameover.depth = shuttle.depth + 1;
		gameover.x = camera.position.x;
		gameover.y = camera.position.y;
		restart.visible = true;
		restart.depth = gameover.depth + 1;
		restart.x = camera.position.x;
		restart.y = camera.position.y + 150;

		//restart the game
		if (mousePressedOver(restart)) {
			game_state = PLAY;
			gameover.visible = false;
			restart.visible = false;
			score = 0;
		}
	}


	//display sprites
	drawSprites();

	//display score
	fill("white");
	textSize(15);
	textFont("courier");
	text("Score: "+score,camera.position.x+150,25);
}

function display_story() {
	//display story
	fill("lightcyan");
	textSize(17.5);
	textFont("courier");
	text("Mission Control to Cosmos 15.",50,50);
	text("The shuttle is passing through the asteroid",5,80);
	text("belt. Autopilot has been disabled and you must",5,100);
	text("manoeuvre the shuttle manually. The Cosmos 15",5,120);
	text("is equipped with lasers that you can use to",5,140);
	text("destroy the asteroids, which would help clear",5,160);
	text("the path for future missions to come. Avoid",5,180);
	text("getting hit by any asteroids. The shuttle is",5,200);
	text("delicate and will be critically damaged by the",5,220);
	text("impact. Stay safe, and good luck.",5,240);
	text("Aim:",50,270);
	text("- Dodge asteroids by moving the Cosmos 15",5,290);
	text("- Destroy asteroids by shooting laser beams",5,310);
	text("Controls:",50,340);
	text("- To move the shuttle up, use the up arrow",5,360);
	text("- To move the shuttle down, use the down arrow",5,380);
	text("- To shoot a laser beam, press the space bar",5,400);
	text("Good Luck!",50,430);
	fill("cornflowerblue");
	text("CLICK ENTER TO CONTINUE",125,470);
}

function spawn_laser() {
	laser = createSprite(shuttle.x+75,shuttle.y,10,10);
	laser.addImage(laser_image);
	laser.scale = 0.075;
	laser.depth = shuttle.depth - 1;
	laser.velocityX = 10;
	laser.setCollider("rectangle",0,0,800,200);
	lasers_group.add(laser);
	laser.lifetime = 75;
}

function spawn_asteroid() {
	asteroid = createSprite(camera.position.x+250,250,10,10);
	asteroid.addImage(asteroid_image);
	asteroid.scale = random(0.05);
	asteroid.setCollider("circle",0,0);
	asteroid.y = random(25,475);
	asteroid.lifetime = 100;
	asteroids_group.add(asteroid);

	shuttle.depth = asteroid.depth + 1;
}