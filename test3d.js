
/*GET ANULAR CONTROLLER*/
var controllerElement = document.querySelector('body');
var controllerScope = angular.element(controllerElement).scope();
console.log(controllerScope);


var canvas = document.getElementById("renderCanvas");

      var engine = new BABYLON.Engine(canvas, true);
var camera = undefined;
      BABYLON.SceneLoader.Load("assets/babylon/", "Office_Test.babylon", engine, function (scene) {
          // Wait for textures and shaders to be ready
          scene.executeWhenReady(function () {

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


console.log(camera);
   //camera.attachControl(canvas);

   BABYLON.SceneLoader.ImportMesh("", "assets/babylon/", "desk.babylon", scene, function (newMeshes) {
     console.log(newMeshes);
     newMeshes[0].position = new BABYLON.Vector3(1,0,0);
      //newMeshes[0].renderOutline = true;

        newMeshes[0].outlineColor =  new BABYLON.Color3(1, 0, 0.7);
        newMeshes[0].outlineWidth = 0.07;
          //newMeshes[0].renderOverlay = true;
    newMeshes[0].overlayAlpha = 0.5;
    newMeshes[0].overlayColor =  new BABYLON.Color3(1, 0, 0);
   });

    BABYLON.SceneLoader.ImportMesh("", "assets/babylon/", "typewriter.babylon", scene, function (newMeshes) {

      newMeshes[0].position = new BABYLON.Vector3(1,1,0);

    });

            scene.clearColor = new BABYLON.Color3(1, 0, 0.7);


              // Once the scene is loaded, just register a render loop to render it
              engine.runRenderLoop(function() {
                  scene.render();
              });


              controllerElement = document.querySelector('body');
              controllerScope = angular.element(controllerElement).scope();
              console.log(controllerScope);

          });
          var onPointerDown = function (evt) {
              if (evt.button !== 0) {
                  return;
              }

              // check if we are under a mesh
              var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh; });
              if (pickInfo.hit) {
                  currentMesh = pickInfo.pickedMesh;
                  console.log(currentMesh);


                  var p = BABYLON.Vector3.Project(currentMesh.position,
                 BABYLON.Matrix.Identity(),
                 scene.getTransformMatrix(),
                 camera.viewport.toGlobal(engine));


                 p.x = p.x/window.devicePixelRatio;
                 p.y = p.y/window.devicePixelRatio;

                 console.log(p.x);
                 console.log(p.y);

                 controllerScope.setPositionTest(p.x,p.y);



              }
          }

          canvas.addEventListener("pointerdown", onPointerDown, false);

      }, function (progress) {
          // To do: give progress feedback to user
      });
