angular.module('game', ['ngDropdowns'])
  .controller('gameController', function($scope, $http, $timeout,$filter) {

    $scope.paused = true;

    init();
    var tick = 0;
    var downtick = 60;

    function init(){

      //UI LOGIC
      $scope.tabs = {
        'reporters' : 'current',
        'audiance' : 'overview'

      }
      $scope.bottombar = 'reporters';
      //GAME LOGIC
      //feedDeskPosition();
      $scope.articles = [];
      $scope.paperProgress = 60;
      //Fetch Reports
      $http.get('data/reporters.json').success(function(data) {
        $scope.reporters = data.reporters;
        //Build reporters function
        $scope.reporters.forEach(function (reporter) {
          reporter.profit = 0;

          reporter.total = (reporter.quality) * (reporter.sources + reporter.jobSatisfaction);

          reporter.assignDesk = function(topic){

            /*TODO Make this ref a mesh*/

            console.log(topic);
            var currentDesk = $filter('filter')($scope.desks, function (d) {return d.id === topic.id;})[0];

            this.desk = currentDesk;
            this.currentDesk = currentDesk;
            currentDesk.reporter = this;
            this.startWriting(topic);

          }
          reporter.startWriting = function(topic) {
            var sources = randomInt(this.sources / this.integraty, this.sources);

            //Writing skills controls how much you can fuck up your skill Writing
            this.article = {
              'headline': 'Man eats own head!', //get rnd header
              'quality': (topic.xp + this.quality) * (sources + this.jobSatisfaction),
              'type': topic,
              'politcal': {
                'left': this.political.left,
                'right': this.political.right //Paper freedom will limit how much this fluxuates
              },
              'trust': (this.integraty * sources) - 50,
              'total': this.total * 2,
              'writing' : true,
              'progress' : 0
            }

          }
          reporter.create3D = function(){
            createReporter(this.id,new BABYLON.Vector3(reporter.lkPos))
          },
          reporter.update = function(){

            //If reporter is at a desk with a topic, then he can add to the papaer and work on own topic
            //Get work speed work speed is
            //Get skill
            //if add paper, fire off paper event from reporter pos to paper pos

            if($scope.paperProgress > 0){
              if((Math.round(genrand_real2() * Math.pow(10, 8)) / Math.pow(10, 8)) > 0.98990139){
                  addToPaper(3);
              }
            }

            if(this.article && this.article.writing){
              //console.log(this.progress);
              //this.progress = Math.ceil(progress / totalTime * 100);
              //Work out percent needed to contribute

              this.article.progress++;

              if(this.article.progress >= 300){
                //pause the game to show?
                $scope.articles.push(this.article);
                this.article.writing = false;
              }

            }
          };
          setTimeout(function(){
              reporter.create3D();
          },1000);

        });


      });


      $scope.setPositionTest = function(x,y){
        //fire animation
        //Fetch position
        $('#deskOptions').css( "transform", "translate(" + x + 'px' + "," + y + 'px' + ")" );
      }
      //Fetch All Topics
      $http.get('data/audiance.json').success(function(data) {
        $scope.audiance = data.audiance;
        $scope.desks = data.audiance.topics;
        $scope.availableDesks = [];

        $scope.desks.forEach(function (desk) {
          desk.assigned = false;
          $scope.availableDesks.push(desk);
        });

        /*TODO attach these options to each desk and pop off the list when assigned.
        Make the desk mesh display what topic it is attached too.*/
      });

      //Fetch All Topics
      $http.get('data/objectssale.json').success(function(data) {
        $scope.objects = data.objects;
      });

      $scope.setDesk = function(mesh){
      //  $scope.availableDesks.pop();
          console.log(mesh);

          changeColor(mesh);
      }
      $scope.buyObject = function(object){

        addObject('test-actor.babylon');
        //Deduct from sum total
        //Add 3D Mesh to scene and attach to mouse cursor (show a grid)
        //If object is a Desk open desk popup to assign desk to topic
          //setDeskType();
      }
      $scope.paperAdd = function(x,y){
        //Fetch position
        $('#deskOptions').css( "transform", "translate(" + x + 'px' + "," + y + 'px' + ")" );
      }

      //Load scean

      //jQuery Stuff
      angular.element(document).ready(function () {
          console.log('page loading completed');
          $('.tooltip').tooltipster();
      });

      //Start Game Loop
      window.requestAnimationFrame(step);
    }
    console.log(BABYLON);

    function addToPaper(ammount){
      $scope.paperProgress -= ammount;

      if($scope.paperProgress >= 0){
        $scope.clipProgress = {
          '-webkit-clip-path': 'polygon(0 ' +$scope.paperProgress +'%, 100% ' + $scope.paperProgress + '%,100% 65%, 0 65%)'
         };
         if($scope.paperProgress >= 40.0){
           $scope.peek = true;
         }else if($scope.paperProgress <= 0){
           console.log('finished paper!');
         }else{
           $scope.peek = false;
         }
      }
    }

    function step() {
      //Game Logic
      if($scope.paused === false){
        if($scope.reporters){
          $scope.reporters.forEach(function (reporter) {
            reporter.update();
          });
        }
        tick += 0.1;
        //downtick -= 0.1;
        $scope.mins = {
          'transform' : 'rotate('+tick+'deg)'
        };
      }
      $scope.$apply();
      //Draw Loop
      window.requestAnimationFrame(step);
    }

    $scope.pauseState = function(bool) {
      $scope.paused = bool;
    }



    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }



  })
  .directive('clock', function() {
   return {
     templateUrl: 'assets/template/clock.html'
   };
 })
 .directive('letter', function() {
  return {
    templateUrl: 'assets/template/letter.html'
  };

})
.directive('reporterTab', function() {
 return {
   templateUrl: 'assets/template/reportersTab.html'
 };
})
.directive('audianceTab', function() {
 return {
   templateUrl: 'assets/template/audianceTab.html'
 };
})
.directive('objectsTab', function() {
 return {
   templateUrl: 'assets/template/objectsTab.html'
 };
})
