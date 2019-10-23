/**
 * @author spidersharma / http://eduperiment.com/
 */

THREE.OutlinePass = function ( width, height, scene, camera, selectedObjects ) 
{

	this.renderScene = scene;
	this.renderCamera = camera;
	this.selectedObjects = selectedObjects;
	this.visibleEdgeColor = new THREE.Color( 1, 1, 1 );

	THREE.Pass.call( this );

	this.resolution = new THREE.Vector2( width, height );

	var pars = { minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, format:THREE.RGBAFormat, anisotropy:0, depthBuffer:false, stencilBuffer:false };

	var resx = Math.round( this.resolution.x );
	var resy = Math.round( this.resolution.y );

	this.maskBufferMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	this.maskBufferMaterial.side = THREE.FrontSide;//THREE.DoubleSide;
	
	this.renderTargetMaskBuffer = new THREE.WebGLRenderTarget( resx, resy, pars );
	this.renderTargetMaskBuffer.texture.name = "OutlinePass.mask";
	this.renderTargetMaskBuffer.texture.generateMipmaps = false;

	this.prepareMaskMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	this.prepareMaskMaterial.side = THREE.FrontSide;//THREE.DoubleSide;

	this.edgeDetectionMaterial = this.getEdgeDetectionMaterial();
	
	this.renderTargetEdgeBuffer = new THREE.WebGLRenderTarget( resx, resy, pars );
	this.renderTargetEdgeBuffer.texture.name = "OutlinePass.edge";
	this.renderTargetEdgeBuffer.texture.generateMipmaps = false;
	
	// Overlay material
	this.overlayMaterial = this.getOverlayMaterial();

	// copy material
	if ( THREE.CopyShader === undefined )
		console.error( "THREE.OutlinePass relies on THREE.CopyShader" );

	var copyShader = THREE.CopyShader;

	this.copyUniforms = THREE.UniformsUtils.clone( copyShader.uniforms );
	this.copyUniforms[ "opacity" ].value = 1.0;

	this.materialCopy = new THREE.ShaderMaterial
	( {
		uniforms:this.copyUniforms,
		vertexShader:copyShader.vertexShader,
		fragmentShader:copyShader.fragmentShader,
		blending:THREE.NoBlending,
		depthTest:false,
		depthWrite:false,
		transparent:true
	} );

	this.enabled = true;
	this.needsSwap = false;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.fsQuad = new THREE.Pass.FullScreenQuad( null );
};

THREE.OutlinePass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), 
{

	constructor: THREE.OutlinePass,

	dispose:function() 
	{
		this.renderTargetMaskBuffer.dispose();
		this.renderTargetEdgeBuffer.dispose();
	},

	setSize:function( width, height ) 
	{
		this.renderTargetMaskBuffer.setSize( width, height );
		this.renderTargetEdgeBuffer.setSize( width, height );
	},

	changeVisibilityOfSelectedObjects:function( bVisible ) 
	{
		function gatherSelectedMeshesCallBack( object ) 
		{
			if( object.isMesh ) 
			{
				if( bVisible ) 
				{
					object.visible = object.userData.oldVisible;
					delete object.userData.oldVisible;

				}
				else 
				{
					object.userData.oldVisible = object.visible;
					object.visible = bVisible;
				}
			}
		}

		for( var i = 0; i < this.selectedObjects.length; i++ ) 
		{
			var selectedObject = this.selectedObjects[ i ];
			selectedObject.traverse( gatherSelectedMeshesCallBack );
		}
	},

	changeVisibilityOfNonSelectedObjects:function( bVisible ) 
	{
		var selectedMeshes = [];

		function gatherSelectedMeshesCallBack( object )
		{
			if( object.isMesh ) selectedMeshes.push( object );
		}

		for( var i = 0; i < this.selectedObjects.length; i++ ) 
		{
			var selectedObject = this.selectedObjects[ i ];
			selectedObject.traverse( gatherSelectedMeshesCallBack );
		}

		function VisibilityChangeCallBack( object ) 
		{
			if ( object.isMesh || object.isLine || object.isSprite ) 
			{
				var bFound = false;

				for( var i = 0; i < selectedMeshes.length; i++ )
				{
					var selectedObjectId = selectedMeshes[ i ].id;

					if( selectedObjectId === object.id ) 
					{
						bFound = true;
						break;
					}
				}

				if( !bFound ) 
				{
					var visibility = object.visible;

					if( !bVisible || object.bVisible ) object.visible = bVisible;

					object.bVisible = visibility;
				}
			}
		}

		this.renderScene.traverse( VisibilityChangeCallBack );
	},

	render:function( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) 
	{
		if( this.selectedObjects.length > 0 ) 
		{

			this.oldClearColor.copy( renderer.getClearColor() );
			this.oldClearAlpha = renderer.getClearAlpha();
			
			var oldAutoClear = renderer.autoClear;

			renderer.autoClear = false;

			if( maskActive ) renderer.context.disable( renderer.context.STENCIL_TEST );

			renderer.setClearColor( 0x000000, 1 );

			// 1. Make non selected objects invisible, and draw only the selected objects, by comparing the depth buffer of non selected objects
			this.changeVisibilityOfNonSelectedObjects( false );
			this.renderScene.overrideMaterial = this.prepareMaskMaterial;

			renderer.setRenderTarget( this.renderTargetMaskBuffer );
			renderer.clear();
			renderer.render( this.renderScene, this.renderCamera );
			
			this.renderScene.overrideMaterial = null;
			this.changeVisibilityOfNonSelectedObjects( true );


			renderer.setClearColor( 0xffffff, 1 );

			// 2. Apply Edge Detection Pass
			
			this.fsQuad.material = this.edgeDetectionMaterial;
			this.edgeDetectionMaterial.uniforms[ "maskTexture" ].value = this.renderTargetMaskBuffer.texture;
			this.edgeDetectionMaterial.uniforms[ "texSize" ].value = new THREE.Vector2( this.renderTargetMaskBuffer.width, this.renderTargetMaskBuffer.height );
			this.edgeDetectionMaterial.uniforms[ "visibleEdgeColor" ].value = this.visibleEdgeColor;
			
			renderer.setRenderTarget( this.renderTargetEdgeBuffer );
			renderer.clear();
			
			this.fsQuad.render( renderer );
			


			// Blend it additively over the input texture
			this.fsQuad.material = this.overlayMaterial;
			this.overlayMaterial.uniforms[ "maskTexture" ].value = this.renderTargetMaskBuffer.texture;
			this.overlayMaterial.uniforms[ "edgeTexture" ].value = this.renderTargetEdgeBuffer.texture;

			if( maskActive ) renderer.context.enable( renderer.context.STENCIL_TEST );

			renderer.setRenderTarget( readBuffer );
			
			this.fsQuad.render( renderer );

			renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );
			renderer.autoClear = oldAutoClear;
		}

		if( this.renderToScreen ) 
		{
			this.fsQuad.material = this.materialCopy;
			this.copyUniforms[ "tDiffuse" ].value = readBuffer.texture;
			
			renderer.setRenderTarget( null );
			
			this.fsQuad.render( renderer );
		}
	},

	getEdgeDetectionMaterial:function() 
	{

		return new THREE.ShaderMaterial( {

			uniforms: {
				"maskTexture": { value: null },
				"texSize": { value: new THREE.Vector2( 0.5, 0.5 ) },
				"visibleEdgeColor": { value: new THREE.Vector3( 1.0, 1.0, 1.0 ) }
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				"varying vec2 vUv;\
				uniform sampler2D maskTexture;\
				uniform vec2 texSize;\
				uniform vec3 visibleEdgeColor;\
				\
				void main() {\n\
					vec2 invSize = 1.0 / texSize;\
					vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);\
					vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);\
					vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);\
					vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);\
					vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);\
					float diff1 = (c1.r - c2.r)*0.5;\
					float diff2 = (c3.r - c4.r)*0.5;\
					float d = length( vec2(diff1, diff2) );\
					float a1 = min(c1.g, c2.g);\
					float a2 = min(c3.g, c4.g);\
					float visibilityFactor = min(a1, a2);\
					gl_FragColor = vec4(visibleEdgeColor, 1.0) * vec4(d);\
				}"
		} );
	},

	getOverlayMaterial:function() 
	{
		return new THREE.ShaderMaterial
		( {
			uniforms: 
			{
				"maskTexture": { value: null },
				"edgeTexture": { value: null },
				"edgeStrength": { value: 2.0 }
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				"varying vec2 vUv;\
				uniform sampler2D maskTexture;\
				uniform sampler2D edgeTexture;\
				uniform float edgeStrength;\
				\
				void main() {\
					vec4 edgeValue = texture2D(edgeTexture, vUv);\
					vec4 maskColor = texture2D(maskTexture, vUv);\
					gl_FragColor = edgeStrength * maskColor.r * edgeValue;\
				}",
			blending:THREE.NormalBlending, //THREE.AdditiveBlending,
			depthTest:false,
			depthWrite:false,
			transparent:true
		} );
	}

} );


