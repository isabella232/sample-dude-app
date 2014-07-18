function SignUpController($scope, $http, $location){
    
    $scope.init = function(){
       	$scope.message = app.TAP_TO_SIGNUP;
        $scope.el = new Everlive(app.everlive.apiKey);
        $scope.loader = $('#signup').find('.loader');
       	
        var spinner = new Spinner({color:"#fff"}).spin();
        
        $scope.loader.append(spinner.el);
    };
  
    $scope.signup = function($event){
        if (!$($event.target).hasClass('hidden')){
           $($event.target).addClass('hidden');
       	}
        
        $scope.loader.show();
        
        $scope.el.Users.register($scope.username, $scope.password, null, function (data) {
            app.application.navigate("#main", "slide:left");
        },
        function(error){
            $scope.loader.hide();
            $($event.target).removeClass('hidden')
            $scope.message = "Signup Failed";
            window.setTimeout(function(){
                $scope.message = app.TAP_TO_SIGNUP;
                $scope.$apply();
            }, 1000); 
            console.log(JSON.stringify(error));
            $scope.$apply();
        });
    };
}