function HomeController($scope, $http, $location){
    
    $scope.login = function(){
        app.application.navigate("#login", "slide:left");
    };
    
    $scope.signup = function(){
		 app.application.navigate("#signup", "slide:left");
    };
    
     $scope.home = function(){
		 app.application.navigate("#home", "slide:right");
    };
}