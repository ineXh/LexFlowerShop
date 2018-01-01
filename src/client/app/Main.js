var PIXI = require('pixi.js');
var assets = require('./loadAssets.js');

//import Main from './index.jsx'
//import loadAssets from './loadAssets.js'


var cow = null;
var Engine = (function(global) {
    document.addEventListener('DOMContentLoaded', function() {
    	//console.log('DomContentLoaded')
    	//debugger;
    	//window.scrollTo(0,1);
    	//document.body.style.overflow = 'hidden';


    	var app = new PIXI.Application(640, 640,
        {backgroundColor : 0x59b4ff, //,
         transparent : false, antialias: true});
    	var worldRenderer = app.renderer;
    	worldRenderer.view.setAttribute("id", "canvas1");
		document.body.appendChild(worldRenderer.view);
		var stage = new PIXI.Container();




		var initialize = function(){
			//console.log('initialize')
			assets.loadTextures();
			var cowTexture = PIXI.Texture.fromFrame("cow");
			cow = new PIXI.Sprite(cowTexture);

		    cow.x = worldRenderer.width / 2;
		    cow.y = worldRenderer.height / 2;
		    cow.dx = 0;
		    cow.anchor.x = 0.5;
		    cow.anchor.y = 0.5;

		    stage.addChild(cow);
		    renderApp();
		    renderAwesome({onX: onX, onXPlus: onXPlus, onXMinus: onXMinus});
		    animate();
		}

		var onX = function(){
			console.log('on X from Main.js')
		}
		var onXPlus = function(){
			//cow.x += 5;
			cow.dx = 5;
		}
		var onXMinus = function(){
			//cow.x -= 5;
			cow.dx = -5;
		}

		//new loadAssets(initialize);
		assets.loadAssets(initialize);
		var update = function(){
	        //updateQueue.update();
	        if(cow) cow.x += cow.dx;
	    }
		function animate() {
            requestAnimationFrame(animate);
            update();
            worldRenderer.render(stage);
    	} // end animate
    }); // end DOMContentLoaded
})(this);
