function HomeController($scope, $http, $location){

    $scope.login = function(){
	    app.application.navigate("#login", "slide");
    };
    
    $scope.signup = function(){
		 app.application.navigate("#signup", "slide");
    };
    
     $scope.home = function(){
		 app.application.navigate("#home", "slide:right");
    };
}