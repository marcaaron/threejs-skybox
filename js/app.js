// if (navigator.geolocation) {
//   alert('Geolocation is supported!');
// }
// else {
//   alert('Geolocation is not supported for this Browser/OS.');
// }



let camera, controls, renderer, scene, pointLight, octaMesh1, octaMesh2, octaMesh3, octaMesh4;
console.log('works');
function init(){
	// Create Renderer
	renderer = new THREE.WebGLRenderer();
	// Set Size of Renderer
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.Type = THREE.PCFSoftShadowMap;

	// Append Renderer to Body as Canvas Element
	document.body.appendChild( renderer.domElement );

	// Create Scene
	scene = new THREE.Scene();

	// Create Camera
	const fov = 75;
	const aspect = window.innerWidth / window.innerHeight;
	const near = 1;
	const far = 1100;
	camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

	// Crete device orientation controls
	controls = new THREE.DeviceOrientationControls( camera );

	// Set the Camera Position
	camera.position.set( 0, 0, 1 );
	// const controls = new THREE.OrbitControls( camera );
	// controls.enableZoom = false;
	// controls.enablePan = false;

	console.log(controls);
	console.log(camera);
	// Add Ambient Light
	const ambientLight = new THREE.AmbientLight( 0x555555, 1.0 );
	scene.add(ambientLight);

	// Create an omnidirectional point light
	pointLight = new THREE.SpotLight( 0xffffff, 1.0 );
	pointLight.castShadow = true;
	// Set Light position halfway between camera and mesh
	pointLight.position.set( 60, 90, -100 );
	scene.add(pointLight);
	// var sphereSize = 1;
	// var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
	// scene.add( pointLightHelper );

}

function initMeshes(){
	const cubeGeometry = new THREE.BoxBufferGeometry(500,500,500);
	var cubeMaterials = [
		new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/front.png"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/back.png"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/up.png"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/down.png"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/right.png"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/left.png"), side: THREE.DoubleSide}),
	];
	const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterials)
	cubeMesh.receiveShadow = true;
	scene.add(cubeMesh);

	var texture = new THREE.TextureLoader().load( 'textures/Stone_5_DiffuseMap.jpg' );
	var material = new THREE.MeshBasicMaterial( { map: texture } );
	var loader = new THREE.OBJLoader();

	loader.load(
		// resource URL
		'models/Stone Pack1_Stone_5.obj',
		// called when resource is loaded
		function ( object ) {
			object.translateZ( -100 );
			object.translateY( 0 );
			object.translateX( 0 );
			object.scale.x = 0.2;
			object.scale.y = 0.2;
			object.scale.z = 0.2;
			object.traverse(function (child) {

	            if (child instanceof THREE.Mesh) {
	                child.material.map = texture;
			        child.castShadow = true;
					child.receiveShadow = false;
	            }

	        });
			const object2 = object.clone();
			object2.translateZ( 200 );
			const object3 = object.clone();
			object3.translateZ( 100 );
			object3.translateX( 100 );
			const object4 = object.clone();
			object4.translateZ( 100 );
			object4.translateX( -100 );

			scene.add( object, object2, object3, object4 );
			var animate = function () {
				requestAnimationFrame( animate );
				object.rotation.x += 0.01;
				object.rotation.y += 0.01;
				object2.rotation.x += 0.01;
				object2.rotation.y += 0.01;
				object3.rotation.x += 0.01;
				object3.rotation.y += 0.01;
				object4.rotation.x += 0.01;
				object4.rotation.y += 0.01;

				renderer.render(scene, camera);
			};
			animate();

		},
		// called when loading is in progresses
		function ( xhr ) {

			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},
		// called when loading has errors
		function ( error ) {

			console.log( 'An error happened' );

		}
	);

}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	// update the camera's frustum
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleOrientation(){
	controls.update();
}

window.addEventListener('deviceorientation', handleOrientation);
window.addEventListener('resize', onWindowResize);

init();
initMeshes();
animate();


function geo_success(position){
	updateLocation(position.coords.latitude, position.coords.longitude);
}

const userInfo = document.querySelector('.user-location');

function updateLocation(lat,long){
	userInfo.innerHTML = `User Position: ${lat} ${long}`;
	if(latStart!==lat){
		latitude = latStart - lat;
		if(latitude && camera.position.z < 150 && camera.position.z > -150){
			camera.position.z = latitude*10000;
		}
	}
	if(longStart!==long){
		longitude = longStart-long;
		if(longitude && camera.position.z < 150 && camera.position.z > -150){
			camera.position.z = longitude*10000;
		}
	}
}

function geo_error() {
console.log("Sorry, no position available.");
}

var geo_options = {
  enableHighAccuracy: true,
  maximumAge        : 0,
  timeout           : Infinity
};
let latStart, longStart;

function geo_success_start(position){
	latStart = position.coords.latitude;
	longStart = position.coords.longitude;
}

window.onload = function() {
	navigator.geolocation.getCurrentPosition(geo_success_start,geo_error,geo_options);
};

var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
console.log(navigator);
