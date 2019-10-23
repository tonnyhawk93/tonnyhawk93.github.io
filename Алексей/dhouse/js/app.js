
	function App()
	{
		
		var width = 600;
		var height = 400;
		var needRender = true;
		var scene, camera, controls, root, light, light2;
		
		const RAYCASTER = new THREE.Raycaster();
		const MOUSE = new THREE.Vector2();
		
		var lastMouseDownTime = 0;
		var lastMouseDownUUID = null;
		var group;
		var panelMaterialData = null;
		var panelMaterialColor = null;
		
		const 	scope = this;
		
		
		const 	textures = [];
		const 	textureLoader = new THREE.TextureLoader();
		const 	envMap =  new THREE.CubeTextureLoader().load( [ "textures/px.png", "textures/nx.png", "textures/py.png", "textures/ny.png", "textures/pz.png", "textures/nz.png" ] );
		
		const 	renderer = new THREE.WebGLRenderer( { antialias:true, stencil:false, powerPreference:"high-performance" } );
				renderer.domElement.style.cssText = "position:absolute;top:0;left:0;margin:0;padding:0;border:0;";
				renderer.setSize( width, height );
				renderer.setClearColor( 0xCCCCCC );
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type =  THREE.VSMShadowMap;//THREE.PCFSoftShadowMap; //
				renderer.shadowMap.autoUpdate = false
				renderer.gammaFactor = 1.2;//2.2;
				renderer.gammaOutput = true;
				
	
		const 	container = document.createElement( "div" );
				container.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;margin:0;padding:0;";
				container.classList.add('house');
				container.appendChild( renderer.domElement );

			
		const 	loader = new THREE.OBJLoader();
				loader.load( "house_new.obj", result => onObjectLoad( result ) );
				
		var needDispatchStart;
		var panels = [];		
		var outlinePassObjects = [];
		
		var renderPass, outlinePass, fxaaPass, composer;
		
		const HAS_TOUCH_EVENTS = "ontouchstart" in window;
		const MOUSE_DOWN = HAS_TOUCH_EVENTS ? "touchstart" : "mousedown";
		const MOUSE_UP = HAS_TOUCH_EVENTS ? "touchend" : "mouseup";
		const MOUSE_UP_OUTSIDE = HAS_TOUCH_EVENTS ? "touchendoutside" : "mouseupoutside";
		const MOUSE_MOVE = HAS_TOUCH_EVENTS ? "touchmove" : "mousemove";

			
		init();
		
		function onObjectLoad( result )
		{
			//console.log( result, result.traverse );

			group = result;

			result.scale.set( .5, .5, .5 );
			result.children.forEach( object => 
			{
				if( object.type == "Mesh" )
				{
					//object.position.y -= 100;
					//object.scale.set( .5, .5, .5 );
					
					var objectName = String( object.name ).toLowerCase();
					var objectId = parseInt( objectName.substr( 1 ) );
					
					var _0 = [ 1, 2, 3, 4, 11, 12, 13, 14 ];
					var _90 = [ 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 38, 39 ];
					var _180 = [ 21, 22, 28, 29];
					
					if( !isNaN( objectId ) )
					{
						//console.log( objectId, objectName, ++c );
						object.isPanel = true;
						//object.materialColor = "#5e4d44";
						
						if( _0.indexOf( objectId ) != -1 ) object.azimuthalAngle = 0;
						else if( _90.indexOf( objectId ) != -1 ) object.azimuthalAngle = 90;
						else if( _180.indexOf( objectId ) != -1 ) object.azimuthalAngle = 180;
						else object.azimuthalAngle = 270;
						
						panels.push( { text:objectName, data:object.azimuthalAngle } );
						
						object.material = new THREE.MeshPhongMaterial( { side:THREE.DoubleSide/*, map:getTexture( 1, "textures/grid.png" )*/ } );
						object.material.color.set( 0x5e4d44 );
						object.material.shininess = 30;
					}
					else 
					{
						//console.log( objectName );
						object.material = new THREE.MeshPhongMaterial( { side:THREE.DoubleSide, map:getTexture( 1, "textures/grid.png" ) } );
					}
					
					if( object.name.indexOf( "stekla" ) != -1 )
					{
						object.material.transparent = true;
						object.material.side = THREE.FrontSide;
						object.material.opacity = 0.8;
						object.material.map =  null;
						object.material.color.set( 0x090909 );
					}
					
					object.geometry.computeVertexNormals();
					object.receiveShadow = true;
					object.castShadow = true;
					//object.matrixAutoUpdate = false
					//object.updateMatrix();
					
					
				}
			} );
			
			//result.matrixAutoUpdate = false
			//result.updateMatrix();
			
			root.add( result );
			
			
			onControlsChange();
			
			renderer.domElement.addEventListener( MOUSE_DOWN, function( event ) 
			{
				event.preventDefault();
				
				if( HAS_TOUCH_EVENTS || event.button == 0 )
				{		
					var time = new Date().getTime();
					
					var containerRect = container.getBoundingClientRect();
					var offsetX = HAS_TOUCH_EVENTS ? event.touches[ 0 ].pageX - containerRect.left : event.offsetX;
					var offsetY = HAS_TOUCH_EVENTS ? event.touches[ 0 ].pageY - containerRect.top : event.offsetY;


					MOUSE.x = ( offsetX / container.clientWidth ) * 2 - 1;
					MOUSE.y = -( offsetY / container.clientHeight ) * 2 + 1;

					RAYCASTER.setFromCamera( MOUSE, camera );

					var intersects = RAYCASTER.intersectObjects( group.children, true ); 
					
					var object = intersects.length > 0 ? intersects[ 0 ].object : null;
					
					if( object)
					{
						var objectName = object.name;

						
						
		
						if( object.isPanel && time - lastMouseDownTime < 500 && lastMouseDownUUID == objectName )
						{	
							/*object.material.color.set( 0x5e4d44 );
							object.material.specular.set( "rgb(6, 6, 6)" );
							object.material.shininess = 30;
							object.material.map = getTexture( 1, "textures/test_bump.png" );
							object.material.bumpMap = getTexture( 1, "textures/test_bump.png" );
							object.material.normalMap = getTexture( 1, "textures/test_normal.png" );
							object.material.needsUpdate = true;
	
							needRender = true;*/
							setMaterial( object, panelMaterialData, panelMaterialColor );
							
								
							
						}
						else 
						{
							
						}

						lastMouseDownUUID = objectName;

						//console.log( objectName );					
					}

					
					lastMouseDownTime = new Date().getTime();
				}

			} );
			
			needDispatchStart = true;

				
			
		}
		
		function onTextureLoad()
		{
			needRender = true;
		}
		
		function getTexture( scale, url )
		{
			var id = scale + "_" + url;
			var texture = textures[ id ];
			
			if( texture === undefined )
			{
				texture = textureLoader.load( url, onTextureLoad );
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set( scale, scale );
				texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
				
				textures[ id ] = texture;
			}
			
			return texture;
		}
		
		function setMaterialDataForPanels( data, color = null )
		{
			panelMaterialData = data;
			panelMaterialColor = color;
			
			//console.log( color );
		}
		
		/*function setColorForPanels( color )
		{
			//panelMaterialColor = color;
			
			console.log( "setColorForPanels: " + panelMaterialColor );
		}*/

		function setObjectMaterialData( name, data, color = null )
		{	
			//console.log( name, data );
			
			if( group )
			{
				var object = group.getObjectByName( name );
				
				if( object ) setMaterial( object, data, color );
			}
		}
		
		function setMaterial( object, data, color = null )
		{
			if( object.isPanel ) object.materialData = data;
			
			var map = null;
			var bumpMap = null;
			var normalMap = null;
					
				if( data && data.map !== undefined )
				{
					map = getTexture( data.scale, data.map );
				}
				
				if( data && data.bumpMap !== undefined )
				{
					bumpMap = getTexture( data.scale, data.bumpMap );
				}
				
				if( data && data.normalMap !== undefined )
				{
					bumpMap = getTexture( data.scale, data.normalMap );
				}

				object.material.normalMap = normalMap;
				object.material.bumpMap = bumpMap;
				object.material.map = map;
					
				if( data && data.opacity !== undefined  )
				{
					object.material.transparent = true;
					object.material.opacity = data.opacity;
					object.material.side = THREE.FrontSide;
				}
				else 
				{
					object.material.side = THREE.DoubleSide;
					object.material.transparent = false;
				}
				
				/*if( panelMaterialColor != null )
				{
					object.material.color = new THREE.Color( panelMaterialColor );
					
					if( object.isPanel ) object.materialColor = panelMaterialColor;
				}
				else */
				
				if( data ) 
				{
					object.material.color = new THREE.Color( color != null ? color : data.color );
					
					//if( object.isPanel ) object.materialColor = color != null ? color : data.color;
				}
				else
				{
					object.material.color = new THREE.Color( color != null ? color : "#FFFFFF" );
					
					//if( object.isPanel ) object.materialColor = null;
				}

				if( data && data.envMap === true )
				{
					if( data.reflectivity !== undefined ) object.material.reflectivity = data.reflectivity;
					
					object.material.envMap = envMap;
				}
				else 
				{
					object.material.envMap = null;	
				}
				
				if( data && data.shininess !== undefined ) object.material.shininess = data.shininess;
				else object.material.shininess = 30;
				
				if( data && data.specular !== undefined ) object.material.specular = new THREE.Color( data.specular );
				else object.material.specular.set( 0x111111 );
				
				
				if( data && data.bumpScale !== undefined ) object.material.bumpScale = data.bumpScale;
				else object.material.bumpScale = 1;
				
				
				object.material.needsUpdate = true;
				
				needRender = true;
		}
		
		
			

		function init()
		{
			//document.body.appendChild( container );

			camera = new THREE.PerspectiveCamera( 55, width / height, 50, 3000 );
			camera.position.set( 0, -5000, 1000 );  // 0, -25, 5
			
			var shadowBoxSize = 600;
			var shadowMapSize = HAS_TOUCH_EVENTS ? 2048 : 4096;
			
			light = new THREE.DirectionalLight( 0xCCCCCC );
			light.position.set( .5, .75, .5 );
			light.castShadow = true;
			light.shadow.camera.near = -shadowBoxSize;
			light.shadow.camera.far = shadowBoxSize;
			light.shadow.camera.right = shadowBoxSize;
			light.shadow.camera.left = -shadowBoxSize;
			light.shadow.camera.top	= shadowBoxSize;
			light.shadow.camera.bottom = -shadowBoxSize;
			light.shadow.mapSize.width = shadowMapSize;
			light.shadow.mapSize.height = shadowMapSize;
			light.shadow.bias = -0.002;
			//light.shadow.radius = 2;

		
			light2 = new THREE.DirectionalLight( 0x111111 );
			light2.position.set( -.5, 0, .25 );
			

			var helper = new THREE.CameraHelper( light.shadow.camera );


			controls = new THREE.OrbitControls( camera, renderer.domElement );
			controls.autoRotate = false;
			controls.enablePan = false;
			controls.enableKeys = false;
			controls.enableDamping = true;
			controls.dampingFactor = .1;
			controls.maxDistance = 1200; // 4
			controls.minDistance = 1200; // 4
			controls.minPolarAngle = Math.PI / 180 * 85;
			controls.maxPolarAngle = Math.PI / 180 * 85;
			controls.update();
			
			controls.maxDistance = 1400; // 6
			controls.minDistance = 800; // 4
			controls.minPolarAngle = Math.PI / 180 * 40;
			controls.maxPolarAngle = Math.PI / 180 * 97;
			
			
			controls.addEventListener( "change", onControlsChange );

			root = new THREE.Object3D();
	
			scene = new THREE.Scene();
			scene.add( camera );
			scene.add( new THREE.AmbientLight( 0x444444 ) );
			scene.add( light );		
			scene.add( light2 );	
			scene.add( root );
			//scene.add( helper );
			
			renderPass = new THREE.RenderPass( scene, camera );

			outlinePass = new THREE.OutlinePass( width, height, scene, camera, outlinePassObjects );

			fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );

			composer = new THREE.EffectComposer( renderer );
			composer.addPass( renderPass );	
			composer.addPass( fxaaPass );
			composer.addPass( outlinePass );
			//composer.addPass( fxaaPass );

			render();

		}
		
		function onControlsChange( event )
		{			
			var p = camera.position.clone();
				p.normalize();
				p.applyAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 180 * -30 );
				
			light.position.copy( p );
			light.position.y = .6;
			
				p = camera.position.clone();
				p.normalize();
				p.applyAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 180 * -30 );
				
			light2.position.copy( p );
			light2.position.y = -.25;
			
			renderer.shadowMap.needsUpdate = true;
			
			needRender = true;
		}
		
		function getAA()
		{
			var aa = controls.getAzimuthalAngle() / Math.PI * 180;
						
			if( aa < 0 ) aa = 360 + aa;
			
			return aa;
		}
		
		function getPA()
		{
			var pa = controls.getPolarAngle() / Math.PI * 180;
						
			if( pa < 0 ) a = 360 + pa;
			
			return pa;
		}
		
		function selectPanel( name, a )
		{
			var object =  group.getObjectByName( name );
			
			if( !object )
			{
				outlinePassObjects.length = 0;
				
				needRender = true;
				
				if( scope.onPanelSelect ) scope.onPanelSelect( null, null, null );
				
				return;
			}
			
			var aa = getAA();
			var pa = getPA();
			var d = a - aa;
			
			//console.log( a, aa, d );
			
			if( d > 180 ) d -= 360;
			if( d < -180 ) d += 360;

			controls.rotateLeft( -d * Math.PI / 180 );
			controls.rotateUp( -( 90 - pa ) * Math.PI / 180 );
			
			//console.log( name );
			
			outlinePassObjects.length = 0;
			outlinePassObjects.push( object );
			
			needRender = true;

			if( scope.onPanelSelect )
			{
				scope.onPanelSelect( name, object.materialData, "#" + object.material.color.getHexString() );
			}
		}
		
		function render( timestamp )
		{
			if( timestamp === undefined || container.offsetWidth != width || container.offsetHeight != height )
			{
				width = container.offsetWidth;
				height = container.offsetHeight;
				
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );
				
				
				
				if( composer ) composer.setSize( width, height );
				
				if( fxaaPass )
				{
					fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / width;
					fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / height;
				}
				
				if( outlinePass ) outlinePass.setSize( width, height );
				
				needRender = true;
			}
			
			controls.update();

			if( needRender )
			{
				needRender = false;
				//renderer.render( scene, camera );
				composer.render();
						
			}
			
			if( needDispatchStart && scope.onStart )
			{
				needDispatchStart = false;
				scope.onStart( panels );
			}
			
			if( scope.onInfo )
			{
				scope.onInfo();
			}
			
			requestAnimationFrame( render );			
		}
		
		scope.domElement = container;
		scope.onStart = null;
		scope.onInfo = null;
		scope.onPanelSelect = null;
		scope.selectPanel = selectPanel;
		scope.getAA = getAA;
		scope.getPA = getPA;
		scope.setObjectMaterialData = setObjectMaterialData;
		scope.setMaterialDataForPanels = setMaterialDataForPanels;
		//scope.setColorForPanels = setColorForPanels;
		
		return scope;
		
	};
	