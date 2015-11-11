var canvas = document.getElementById("renderCanvas");
      var engine = new BABYLON.Engine(canvas, true);

      BABYLON.SceneLoader.Load("assets/babylon/", "Office_Test.babylon", engine, function (scene) {
          // Wait for textures and shaders to be ready

          var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, -10, new BABYLON.Vector3(0, 0,10), scene);

          camera.setPosition(new BABYLON.Vector3(20, 200, 400));

          camera.lowerBetaLimit = 0.1;
          camera.upperBetaLimit = (Math.PI / 2) * 0.99;
          camera.lowerRadiusLimit = 150;
          scene.clearColor = new BABYLON.Color3(0, 1, 0.7);


          scene.meshes.forEach(function(mesh) {
              mesh.convertToFlatShadedMesh();
            });

            // Events
            var canvas = engine.getRenderingCanvas();
            var startingPoint;
            var currentMesh;



            var getGroundPosition = function () {
                // Use a predicate to get position on the ground
                var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh.name == 'Plane'});
                if (pickinfo.hit) {
                    return pickinfo.pickedPoint;
                }

                return null;
            }

            var onPointerDown = function (evt) {
                if (evt.button !== 0) {
                    return;
                }
                // check if we are under a mesh
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh.name == 'Plane' });

                if (pickInfo.hit) {
                    currentMesh = pickInfo.pickedMesh;
                    startingPoint = getGroundPosition(evt);
                    console.log(currentMesh);


                    var p = BABYLON.Vector3.Project(currentMesh.position,
                   BABYLON.Matrix.Identity(),
                   scene.getTransformMatrix(),
                   camera.viewport.toGlobal(engine));


                   p.x = p.x/window.devicePixelRatio;
                   p.y = p.y/window.devicePixelRatio;

                   console.log(p.x);
                   console.log(p.y);


                    if (startingPoint) { // we need to disconnect camera from canvas
                        setTimeout(function () {
                            camera.detachControl(canvas);
                        }, 0);
                    }
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

                var current = getGroundPosition(evt);

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


          scene.executeWhenReady(function () {


              // Attach camera to canvas inputs
              /*scene.activeCamera.attachControl(canvas);*/

              // Once the scene is loaded, just register a render loop to render it
              engine.runRenderLoop(function() {
                  scene.render();
              });
          });
      }, function (progress) {
          // To do: give progress feedback to user
      });
