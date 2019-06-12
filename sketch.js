/* VARIABLES DECLARATION */

let scene, camera, renderer, geometry, material, circle, rect;
let rotate = true;
let objects = []; // Tab for all objects colliding with the ball
let velocity_x = 0;
let velocity_y = 0;
const mass = 10;
const gravity = 0.05;


/* INIT - ANIMATE SCENE */

function letsPlay() {
	init();
	animate();
}

function windowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
	scene = new THREE.Scene();
	setCamera() 
	setRenderer()
	setObjects();
	window.addEventListener('click', () => {rotate = false;});
	window.addEventListener( 'resize', windowResize, false );
}

function setCamera() {
	camera = new THREE.PerspectiveCamera(95, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.z = 5;
}

function setRenderer() {
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function setObjects() {
	geometry = new THREE.CircleGeometry(0.3, 40);
	material = new THREE.MeshBasicMaterial({color: 0xffffff});
	ball = new THREE.Mesh(geometry, material);
	scene.add(ball);
	ball.position.y = 4;

	geometry = new THREE.BoxGeometry(6, 0.5, 0.1);
	material = new THREE.MeshBasicMaterial({color: 0xffffff});
	rect = new THREE.Mesh(geometry, material);
	scene.add(rect);
	rect.position.y = -2;
	objects.push(rect);
}

function animate() {
	requestAnimationFrame(animate);
	if (rotate)
		rect.rotation.z -= 0.02;
	else
		ballPhysics();
	render();
}

function render() {
	renderer.clear;
	renderer.render(scene, camera);
	checkCollision();
}

function checkOutside() {
	if (ball.position.y <= -5 || ball.position.y >= 5 || ball.position.x >= 10 || ball.position.x <= -10)
		restart();
}

function restart() {
	ball.position.y = 4;
	ball.position.x = 0;
	velocity_x = 0;
	velocity_y = 0;
	rotate = true;
}


/* COLLISION AND BOUNCING BALL */

function getNormalVector(a) { 
	return ({x: Math.sin(a), y: -Math.cos(a)}); 
}

function checkCollision() { 
	let originPoint = this.ball.position.clone();
	// Check ball coordinate
	for (let vertexIndex = 0; vertexIndex < this.ball.geometry.vertices.length; vertexIndex++) {
		let localVertex = this.ball.geometry.vertices[vertexIndex].clone();
		let globalVertex = localVertex.applyMatrix4(this.ball.matrix);
		let directionVector = globalVertex.sub(this.ball.position);
		let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
		let collisionResults = ray.intersectObjects(objects);
		// Enter collision 
		if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
			let normalVector = getNormalVector(rect.rotation.z);
			let d = 1 * (velocity_x * normalVector.x + ball.position.y * normalVector.y) / 100;
			velocity_x -= d * normalVector.x;
			velocity_y -= d * normalVector.y;
		}
	}
}

function ballPhysics() {
	let fx = 0;
	let ag = 9.81 / 100;
	let ax = fx / mass;
	let ay = (ag * gravity);
	// Calculating ball velocity
	velocity_x += ax;
	velocity_y -= ay;
	// Calculating ball position
	ball.position.x += velocity_x;
	ball.position.y += velocity_y;
	checkOutside();
}

letsPlay();