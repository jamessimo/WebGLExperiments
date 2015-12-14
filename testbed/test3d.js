/*GET ANULAR CONTROLLER*/
/*var controllerElement = document.querySelector('body');
var controllerScope = angular.element(controllerElement).scope();
console.log(controllerScope);
*/

var canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas, true);
var camera = undefined;
var sceneMaster = undefined;

var objectGrid = [{
    "object": "desk.babylon",
    "pos3": {
      x: 2,
      y: 0,
      z: -3
    },
    "pos2": {
      i: 8,
      j: 3
    }
  }, {
    "object": "typewriter.babylon",
    "pos3": {
      x: 2,
      y: 1,
      z: -3
    },
    "pos2": {
      i: 2,
      j: 3
    }
  },

  {
    "object": "desk.babylon",
    "pos3": {
      x: -6,
      y: 0,
      z: -6
    },
    "pos2": {
      i: 0,
      j: 0
    }
  },

];




var grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];



var ground;
var startingPoint;
var currentMesh;

BABYLON.SceneLoader.Load("assets/babylon/", "Office_Test.babylon", engine, function(scene) {
  sceneMaster = scene;
  console.log(scene);


   //ground = scene.meshes[0];
   //Create floor

   ground = BABYLON.Mesh.CreatePlane("ground", 12, scene);

   ground.rotation.x = Math.PI / 2;
   ground.position.y = 0.0;
   ground.isPickable = false;

  // Wait for textures and shaders to be ready
  scene.executeWhenReady(function() {



    // Attach camera to canvas inputs
    camera = scene.activeCamera;

    camera.attachControl(canvas);


    /*  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(7.4811, 5.3437, -6.5076));
    */

    camera.lowerBetaLimit = 0.6;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 16;
    camera.upperRadiusLimit = 30;


    //camera.attachControl(canvas);
    var lockout = 0;
    for (var i = 0; i < objectGrid.length; i++) {

      // grid[objectGrid[i].pos2.i][objectGrid[i].pos2.j] = 1;
      var d = objectGrid[i].pos3.x + 6;
      var g = objectGrid[i].pos3.z + 6;
      grid[d][g] = 1;
      BABYLON.SceneLoader.ImportMesh("", "assets/babylon/", objectGrid[i].object, scene, function(newMeshes) {

        newMeshes[0].position = new BABYLON.Vector3(objectGrid[lockout].pos3.x,objectGrid[lockout].pos3.y,objectGrid[lockout].pos3.z);
        lockout++;
      });

    }


    BABYLON.SceneLoader.ImportMesh("", "assets/babylon/", "derp.babylon", scene, function(newMeshes) {
      console.log(newMeshes);
      newMeshes[0].position = new BABYLON.Vector3(1, 0, 0);
      //newMeshes[0].renderOutline = true;

      newMeshes[0].outlineColor = new BABYLON.Color3(1, 0, 0.7);
      newMeshes[0].outlineWidth = 0.07;
      //newMeshes[0].renderOverlay = true;
      newMeshes[0].overlayAlpha = 0.5;
      newMeshes[0].overlayColor = new BABYLON.Color3(1, 0, 0);
    });

    BABYLON.SceneLoader.ImportMesh("", "assets/babylon/", "ww.babylon", scene, function(newMeshes) {

      newMeshes[0].position = new BABYLON.Vector3(1, 1, 0);

    });


    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        var plane = BABYLON.Mesh.CreatePlane("plane", 1, scene);
        plane.position = new BABYLON.Vector3(i - 6, 0.19, j - 6);
        plane.rotation.x = Math.PI / 2;
        plane.isPickable = false;
        var planeMat = new BABYLON.StandardMaterial("texture1", scene);
        planeMat.diffuseColor = new BABYLON.Color3(grid[i][j], grid[i][j], grid[i][j]);
        plane.material = planeMat;
        plane.array2D = {
          'i': i,
          'j': j
        };
      }
    }

    scene.clearColor = new BABYLON.Color3(1, 0, 0.7);


    // Once the scene is loaded, just register a render loop to render it
    engine.runRenderLoop(function() {
      scene.render();
    });


    controllerElement = document.querySelector('body');
    controllerScope = angular.element(controllerElement).scope();
    console.log(controllerScope);

  });



  var onPointerDown = function(evt) {
    if (evt.button !== 0) {
      return;
    }

        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground});
        if (pickInfo.hit) {


          currentMesh = pickInfo.pickedMesh;

          if(currentMesh.isPickable){ //dont move un-pickabkes
            startingPoint = getGroundPosition();
          }



            if (startingPoint) { // we need to disconnect camera from canvas
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }

                  if (currentMesh.array2D) {
                    if (grid[currentMesh.array2D.i, currentMesh.array2D.j] === 1)
                      grid[currentMesh.array2D.i, currentMesh.array2D.j] = 0;
                    else
                      grid[currentMesh.array2D.i, currentMesh.array2D.j] = 1;

                    var whiteMat = new BABYLON.StandardMaterial("texture2", scene);
                    whiteMat.diffuseColor = new BABYLON.Color3(grid[currentMesh.array2D.i, currentMesh.array2D.j], grid[currentMesh.array2D.i, currentMesh.array2D.j], grid[currentMesh.array2D.i, currentMesh.array2D.j]);
                    currentMesh.material = whiteMat;
                  }

                  var p = BABYLON.Vector3.Project(currentMesh.position,
                    BABYLON.Matrix.Identity(),
                    scene.getTransformMatrix(),
                    camera.viewport.toGlobal(engine));

                  p.x = p.x / window.devicePixelRatio;
                  p.y = p.y / window.devicePixelRatio;

                  //console.log(p.x);
                  //console.log(p.y);

                  controllerScope.setPositionTest(p.x, p.y);

        }


  }

  var onPointerUp = function () {
      if (startingPoint) {
          camera.attachControl(canvas, true);
          startingPoint = null;
          return;
      }
  }

  var onPointerMove = function (evt) {
      if (!startingPoint) {
          return;
      }

      var current = getGroundPosition();

      if (!current) {
          return;
      }

      var diff = current.subtract(startingPoint);
      currentMesh.position.addInPlace(diff);

      startingPoint = current;

  }

  canvas.addEventListener("pointerdown", onPointerDown, false);
     canvas.addEventListener("pointerup", onPointerUp, false);
     canvas.addEventListener("pointermove", onPointerMove, false);

     scene.onDispose = function () {
         canvas.removeEventListener("pointerdown", onPointerDown);
         canvas.removeEventListener("pointerup", onPointerUp);
         canvas.removeEventListener("pointermove", onPointerMove);
     }
}, function(progress) {
  // To do: give progress feedback to user
});


 getGroundPosition = function () {
      // Use a predicate to get position on the ground
      console.log(sceneMaster.pointerX);
      var pickinfo = sceneMaster.pick(sceneMaster.pointerX, sceneMaster.pointerY, function (mesh) {return mesh == ground; });
      console.log(pickinfo);

      if (pickinfo.hit) {
          return pickinfo.pickedPoint;
      }

      return null;
  }


createReporter = function(id, pos) {
  BABYLON.SceneLoader.ImportMesh("", "assets/babylon/", "test-actor.babylon", sceneMaster, function(newMeshes) {
    newMeshes[0].position = pos;

    //Set the actors collision info
    var d = newMeshes[0].position.x + 6;
    var g = newMeshes[0].position.z + 6;
    grid[d][g] = 1;
    newMeshes[0].gameId = id;
  });
}

addObject = function(mesh) {
  BABYLON.SceneLoader.ImportMesh("", "assets/babylon/", mesh, sceneMaster, function(newMeshes) {

    startingPoint = getGroundPosition();

  /*  newMeshes[0].position = pos;
    var d = newMeshes[0].position.x + 6;
    var g = newMeshes[0].position.z + 6;
    grid[d][g] = 1;
    newMeshes[0].gameId = id;*/
  });
}
