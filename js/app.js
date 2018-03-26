// if (navigator.geolocation) {
//   alert('Geolocation is supported!');
// }
// else {
//   alert('Geolocation is not supported for this Browser/OS.');
// }



let camera, projector, mouseVector, controls, renderer, scene, pointLight, octaMesh1, octaMesh2, octaMesh3, octaMesh4, raycaster;
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
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

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
	// const cubeGeometry = new THREE.BoxBufferGeometry(500,500,500);
	// var cubeMaterials = [
	// 	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/front.png"), side: THREE.DoubleSide}),
	// 	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/back.png"), side: THREE.DoubleSide}),
	// 	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/up.png"), side: THREE.DoubleSide}),
	// 	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/down.png"), side: THREE.DoubleSide}),
	// 	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/right.png"), side: THREE.DoubleSide}),
	// 	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/Skybox/left.png"), side: THREE.DoubleSide}),
	// ];
	// const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterials)
	// cubeMesh.receiveShadow = true;
	// scene.add(cubeMesh);

	scene.background = new THREE.CubeTextureLoader()
	.setPath( 'img/Skybox/' )
	.load( [ 'front.png', 'back.png', 'up.png', 'down.png', 'right.png', 'left.png' ] );
	scene.background.receiveShadow = true;

	var textureStone = new THREE.TextureLoader().load( 'textures/Stone_5_DiffuseMap.jpg' );
	var randomTexture = new THREE.TextureLoader().load( 'textures/random.png' );
		randomTexture.wrapS = randomTexture.wrapT = THREE.RepeatWrapping;
		randomTexture.offset.set( 0, 0 );
		randomTexture.repeat.set(3,3);

	var opalTexture = new THREE.TextureLoader().load( 'textures/opal3.png' );
		opalTexture.wrapS = opalTexture.wrapT = THREE.RepeatWrapping;
		opalTexture.offset.set( 0, 0 );
		opalTexture.repeat.set(4,4);

	var emissiveMaterial = new THREE.MeshLambertMaterial();
		emissiveMaterial.emissive = new THREE.Color(0x721ac0);
		emissiveMaterial.emissiveIntensity = 1;
	var randomMaterial = new THREE.MeshLambertMaterial( { alphaMap: randomTexture, transparent: true } );

	var stoneMaterial = new THREE.MeshPhongMaterial( { map: textureStone } );


	var opalMaterial = new THREE.MeshLambertMaterial( { map: opalTexture } );

	var reflectMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0xffffff,
			envMap: scene.background
		}
	);

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
					child.material = reflectMaterial;
			        child.castShadow = true;
					child.receiveShadow = false;
					console.log(child);
					// var geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
					// geometry.computeFaceNormals();
					// geometry.mergeVertices();
					// geometry.computeVertexNormals(false);
					// child.geometry = new THREE.BufferGeometry().fromGeometry( geometry );

	            }

	        });
			const object2 = object.clone();
			object2.translateZ( 200 );
			for(let i=0; i<object2.children.length; i++){
				object2.children[i].material = object.children[i].material.clone();
			}
			object2.children.forEach((child)=>{
				child.material = stoneMaterial;
			});

			const object3 = object.clone();
			object3.translateZ( 100 );
			object3.translateX( 100 );
			for(let i=0; i<object3.children.length; i++){
				object3.children[i].material = object.children[i].material.clone();
			}
			object3.children.forEach((child)=>{
				child.material = randomMaterial;
			});

			const object4 = object.clone();
			object4.translateZ( 100 );
			object4.translateX( -100 );

			for(let i=0; i<object4.children.length; i++){
				object4.children[i].material = object.children[i].material.clone();
			}
			object4.children.forEach((child)=>{
				child.material = opalMaterial;
			});


			scene.add( object, object2, object3, object4 );
			const objects = [];
			objects.push(object, object2, object3, object4);
			console.log(objects);
			// function onMousemove(e){
			// 	mouseVector.x = 2 * (e.clientX) - 1;
			// 	mouseVector.y = 1 - 2 * ( e.clientY );
			// 	raycaster.setFromCamera( mouseVector.clone(), camera );
			// }
			projector = new THREE.Projector();

			// function onMousedown(e){
			// 	console.log(object);
			// 	event.preventDefault();
		    //     var mouseX = (event.clientX / window.innerWidth)*2-1;
		    //     var mouseY = -(event.clientY /window.innerHeight)*2+1;
		    //     var vector = new THREE.Vector3( mouseX, mouseY, 0.5 );
		    //     projector.unprojectVector( vector, camera );
		    //     var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
			// 	var intersects = raycaster.intersectObjects( objects, true );
			// 	console.log(intersects, mouseVector);
			// 	console.log(intersects[0]);
			// 	// intersects[0].object.scale.z = intersects[0].object.scale.z*2;
			// 	console.log(intersects[0].object.scale.x);
			// 	animate2(intersects[0].object);
			// }
			//
			// // window.addEventListener( 'mousemove', onMousemove, false );
			// window.addEventListener( 'mousedown', onMousedown, false );

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

			let size = 0.1;
			let grow = true;
				// console.log(object.children[0].geometry.morphAttributes);

			var animate2 = function () {
				requestAnimationFrame( animate2 );
				if(grow){
					size += 0.01;
					object.scale.x += size/1000;
					object.scale.y += size/1000;
					object.scale.z += size/1000;
				}else{
					size -= 0.01;
					object.scale.x -= size/1000;
					object.scale.y -= size/1000;
					object.scale.z -= size/1000;
				}

				if(size > 1){
					grow = false;
				}

				if(size < 0){
					grow=true;
				}
				// console.log(size, object.scale);

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

// Location Services

// function geo_success(position){
// 	updateLocation(position.coords.latitude, position.coords.longitude);
// }
//
// const userInfo = document.querySelector('.user-location');
//
// function updateLocation(lat,long){
// 	userInfo.innerHTML = `User Position: ${lat} ${long}`;
// 	if(latStart!==lat){
// 		latitude = latStart - lat;
// 		if(latitude && camera.position.z < 150 && camera.position.z > -150){
// 			camera.position.z = latitude*10000000;
// 		}
// 	}
// 	if(longStart!==long){
// 		longitude = longStart-long;
// 		if(longitude && camera.position.z < 150 && camera.position.z > -150){
// 			camera.position.z = longitude*10000000;
// 		}
// 	}
// }
//
// function geo_error() {
// console.log("Sorry, no position available.");
// }
//
// var geo_options = {
//   enableHighAccuracy: true,
//   maximumAge        : 0,
//   timeout           : Infinity
// };
// let latStart, longStart;
//
// function geo_success_start(position){
// 	latStart = position.coords.latitude;
// 	longStart = position.coords.longitude;
// }
//
// window.onload = function() {
// 	navigator.geolocation.getCurrentPosition(geo_success_start,geo_error,geo_options);
// };
//
// var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
// console.log(navigator);
