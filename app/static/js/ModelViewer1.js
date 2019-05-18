


var modelfilename = ""


function setup () {
    console.log('Model viewer is a go')
    setupThree()
    LoadModel()
}


var renderer
var geometry =  new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50 } );
var cube = new THREE.Mesh( geometry, material );

var cameraCube, sceneCube;

var loadingManager
var loader

var ambientLight
var directionalLight

var container, stats, clock;
var camera, scene, renderer, testmodel;

var controls, Orientationcontrols
var projector
function clickhandlers() {

    document.addEventListener('dblclick', ondblclick, false);

}

var playforward = true

function ondblclick(event) {
    if (playforward) {
        playforward = false
        anim = mixer.clipAction(gltfFile.animations[0])
        anim.setLoop(THREE.LoopOnce)
        anim.time = 0
        anim.timeScale = 1
        anim.clampWhenFinished = true
        anim.paused = false
        anim.play()
        let newposition = new THREE.Vector3(0, 1, 0)
        newposition.copy(model.position)
        newposition.y = 8
        controls.target.copy( newposition );
    } else {
        playforward = true
        anim = mixer.clipAction(gltfFile.animations[0])
        anim.setLoop(THREE.LoopOnce)
        anim.time = 2.5
        anim.timeScale = -1
        anim.clampWhenFinished = true
        anim.paused = false
        anim.play()
        let newposition = new THREE.Vector3(0, 1, 0)
        newposition.copy(model.position)
        newposition.y = 0
        controls.target.copy( newposition );
        if ("2" == modelnumber) {
            camera.position.set( 4, 1.5, 2.5 );
            //camera.lookAt( 0, 3, 0 );
        } else {
            camera.position.set( 4, 1.5, 2.5 );
            //camera.lookAt( 0, 3, 0 );
        }
    }
    controls.update();
     // x = (event.clientX / window.innerWidth) * 2 - 1;
     //y = -(event.clientY / window.innerHeight) * 2 + 1;
     //dir = new THREE.Vector3(x, y, -1)
     //dir.unproject(camera)

     //ray = new THREE.Raycaster(camera.position, dir.sub(camera.position).normalize())
     //var intersects = ray.intersectObject(model);
     //if ( intersects.length > 0 )
     //{
     //    alert("hit");
     //}
}
var modelnumber = "1"
function setupThree() {
    renderer = new THREE.WebGLRenderer({
    antialiasing: true,
    precision: "mediump"
    });
    //renderer.setPixelRatio( 1 );
    //renderer.setSize( innerWidth, innerHeight );
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    if ("2" == modelnumber) {
        camera.position.set( 4, 1.5, 2.5 );
        camera.lookAt( 0, 3, 0 );
    } else {
        camera.position.set( 4, 1.5, 2.5  );
        camera.lookAt( 0, 3, 0 );
    }


    //scene.add( cube );

    clock = new THREE.Clock();

    renderer.setSize( window.innerWidth, window.innerHeight );
   $("#binst-canvas-holder").append( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.update();
    //Orientationcontrols = new THREE.DeviceOrientationControls( camera, renderer.domElement );
    //Orientationcontrols.update();

    projector = new THREE.Projector();
    clickhandlers()
    animate();
}

function LoadOBJModel() {

}
var mixer = null;
var model
var gltfFile
function LoadglTFModel() {
    var loader = new THREE.GLTFLoader();

    loader.load(modelfilename, function ( gltf ) {
        model = gltf.scene;
        scene.add(model);
        controls.target.copy( model.position );
        mixer = new THREE.AnimationMixer(model);
    	scene.add( gltf.scene );
    	gltfFile = gltf
    }, undefined, function ( error ) {
    	console.error( error );
    } );
}

function LoadFBXModel() {
    loader = new THREE.FBXLoader( loadingManager );
        loader.load( 'static/3DModels/FBXFile/FBXFILE.fbx', function ( objwct ) {
        	//testmodel = collada.scene;
        	//testmodel.scale.set(5,5,5);
        	//controls.target.copy( testmodel.position );
        	scene.add( objwct );
        	console.log('model loaded')
        });
}

var textureEquirec
function LoadEnvironement() {
    var textureLoader = new THREE.TextureLoader();
    textureEquirec = textureLoader.load( "static/3DModels/FBXFile/environment_hdri___warehouse_with_pallets_by_zephyris-d96jv3a.jpg" );
    textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
    textureEquirec.magFilter = THREE.LinearFilter;
    textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;
    textureEquirec.encoding = THREE.sRGBEncoding;
    //textureSphere = textureLoader.load( "textures/metal.jpg" );
    //textureSphere.mapping = THREE.SphericalReflectionMapping;
    //textureSphere.encoding = THREE.sRGBEncoding;
    // Materials
    var equirectShader = THREE.ShaderLib[ "equirect" ];
    var equirectMaterial = new THREE.ShaderMaterial( {
    	fragmentShader: equirectShader.fragmentShader,
    	vertexShader: equirectShader.vertexShader,
    	uniforms: equirectShader.uniforms,
    	depthWrite: false,
    	side: THREE.BackSide
    } );
    equirectMaterial.uniforms[ "tEquirect" ].value = textureEquirec;
    // enable code injection for non-built-in material
    Object.defineProperty( equirectMaterial, 'map', {
    	get: function () {
    		return this.uniforms.tEquirect.value;

    	}
    } );
    var cubeShader = THREE.ShaderLib[ "cube" ];
    var cubeMaterial = new THREE.ShaderMaterial( {
    	fragmentShader: cubeShader.fragmentShader,
    	vertexShader: cubeShader.vertexShader,
    	uniforms: cubeShader.uniforms,
    	depthWrite: false,
    	side: THREE.BackSide
    } );

    textureCube = new THREE.CubeTextureLoader().load(["static/3DModels/FBXFile/environment_hdri___warehouse_with_pallets_by_zephyris-d96jv3a.jpg"]);
    textureCube.format = THREE.RGBFormat;
    textureCube.mapping = THREE.CubeReflectionMapping;
    textureCube.encoding = THREE.sRGBEncoding;

    sceneCube = new THREE.Scene();

    cubeMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 100, 100, 100 ), cubeMaterial );
    sceneCube.add( cubeMesh );

    var geometry = new THREE.SphereBufferGeometry( 400.0, 48, 24 );
    sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureCube } );
    sphereMesh = new THREE.Mesh( geometry, sphereMaterial );
    scene.add( sphereMesh );

    cubeMesh.material = equirectMaterial;
    cubeMesh.visible = true;
    sphereMaterial.envMap = textureEquirec;
    sphereMaterial.needsUpdate = true;
}

function LoadModel() {

    LoadglTFModel()
    //LoadEnvironement()

    ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
    scene.add( ambientLight );

    for (let i = -5;i < 5;i++) {
        let directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.05 );
        directionalLight3.position.set( 0.2 * i, 1, 0.5 ).normalize();
        scene.add( directionalLight3);
    }
    for (let i = -5;i < 5;i++) {
            let directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.05 );
            directionalLight3.position.set( 0.2 * i, 1, -0.5 ).normalize();
            scene.add( directionalLight3);
        }
    directionalLight2 = new THREE.DirectionalLight( 0xffffbb, 1);
    directionalLight2.position.set( 0, -1, 0 ).normalize();
    scene.add( directionalLight2 );
}

function animate() {
	requestAnimationFrame( animate );

    var delta = clock.getDelta();
    if (mixer != null) {
        mixer.update(delta);

    };

	renderer.render( scene, camera );
}

//# sourceURL=ModelViewer1.js