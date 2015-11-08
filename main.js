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
          reporter.update = function(){

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
                $scope.articles.push(this.article);
                this.article.writing = false;
              }

            }
          };
        });
      });
      //Fetch All Topics
      $http.get('data/audiance.json').success(function(data) {
        $scope.audiance = data.audiance;
        $scope.desks = data.audiance.topics;

      });

      //Load scean

      //jQuery Stuff
      angular.element(document).ready(function () {
          console.log('page loading completed');
          $('.tooltip').tooltipster();
      });

      //Start Game Loop
      window.requestAnimationFrame(step);
    }

    function addToPaper(ammount){
      $scope.paperProgress -= ammount;

      if($scope.paperProgress >= 0){
        $scope.clipProgress = {
          '-webkit-clip-path': 'polygon(0 ' +$scope.paperProgress +'%, 100% ' + $scope.paperProgress + '%,100% 65%, 0 65%)'
         };
         if($scope.paperProgress >= 40.0){
           $scope.peek = true;
         }else if($scope.paperProgress <= 0){
           console.log('finished paper!')

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

/*



    $http.get('audiance.json').success(function(data) {
      console.log(data);
      $scope.audiance = data.audiance;
      $scope.desks =  data.audiance.topics;
    });

    $scope.articles = [];
    function init(){
      //Loop through all reports

    }

    $scope.hire = function(id) {
      //send ID to Server
    }


    $scope.assignDesk = function(r,desk) {
      var currentDesk = $filter('filter')($scope.desks, function (d) {return d.id === desk.id;})[0];
      currentDesk.reporter = r;
      $scope.startWriting(r,desk.id);

    }
    $scope.startWriting = function(r,tid) {
      window.requestAnimationFrame(step);
      var start = null;
      var sources = randomInt(r.sources / r.integraty, r.sources);
      var topic = $filter('filter')(r.skills, function (d) {return d.id === tid;})[0];
      console.log(topic);
      $scope.currentTopic = tid;
      $scope.total = (topic.xp + r.quality) * (r.sources + r.jobSatisfaction);

      //Writing skills controls how much you can fuck up your skill Writing
      r.article = {
        'headline': 'Man eats own head!', //get rnd header
        'quality': (topic.xp + r.quality) * (sources + r.jobSatisfaction),
        'type': topic,
        'politcal': {
          'left': r.political.left,
          'right': r.political.right //Paper freedom will limit how much this fluxuates
        },
        'trust': (r.integraty * sources) - 50,
        'total': $scope.total
      }

      var totalTime = 2000;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        if (progress <= totalTime) {
          r.progress = Math.ceil(progress / totalTime * 100);
          tick = (progress / totalTime * 360);
          $scope.mins = {
            'transform' : 'rotate('+tick+'deg)'
          };
          $scope.$apply();
          window.requestAnimationFrame(step);
        } else {
          tick = 0;
          progress = false;
          start = null;
          $scope.articles.push(r.article);
          $scope.$apply();
        }
      }
    }

    $scope.publish = function(r) {

      window.requestAnimationFrame(step);

      var start = null;

      function step(timestamp) {
        $scope.publishedArticle = r.article;

        if (!start) start = timestamp;
        var progress = timestamp - start;
        if (progress <= 4000) {
          $scope.publishedArticle.progress = Math.ceil(progress / 4000 * 100);
          $scope.$apply();
          window.requestAnimationFrame(step);

        } else {

          //Audiance
            if($scope.audiance.political.left > r.article.political.left){
                //No bonus
            }else{
              //bonus
            }
          //Audiance
          if ($scope.audiance.expectedQuality > r.article.quality) {
            // deduct score
          } else {
            //bonus
          }


          $scope.publishedArticle.score = r.article.quality;
          $scope.publishedArticle.sold = 312; //Base buyers * poltical + quality // Grow fanbase
          $scope.publishedArticle.profit = 981;

          progress = false;
          start = null;
          $scope.$apply();
        }

      }

    }


    */
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
