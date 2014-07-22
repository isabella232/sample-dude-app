function AccountController($scope, $http, $location){
    var EMPTY = "";

    $scope.username = EMPTY;
    $scope.password = EMPTY;

    $scope.init = function(id){
        if (id.toLowerCase() === "#login")
             $scope.message = app.TAP_TO_LOGIN;
        else
        	$scope.message = app.TAP_TO_SIGNUP;
       
        $scope.loader = $(id).find('.loader');

        var spinner = new Spinner({color:"#fff", width:3}).spin();

        $scope.loader.append(spinner.el);
    };

    $scope.signup = function($event){
      	$scope.spin($event);

        var username = $scope.username.trim().toUpperCase();

        app.el.Users.register(username, $scope.password.toString(), null, function (data) {
            app.PushRegistrar.enablePushNotifications(username);
            app.application.navigate("#main", "slide:left");
        },
        function(error){
            $scope.stop($event);
            if (error.code === 201)
                $scope.message = "Already Taken";
            else
            	$scope.message = "Signup Failed";
            window.setTimeout(function(){
                $scope.message = app.TAP_TO_SIGNUP;
                $scope.$apply();
            }, 1000);
            console.log(JSON.stringify(error));
            $scope.$apply();
        });
    };

    $scope.spin = function($event){
        if (!$($event.target).hasClass('hidden')){
           $($event.target).addClass('hidden');
       	}
        $scope.loader.show();
    };

    $scope.stop = function($event){
        $scope.loader.hide();
        $($event.target).removeClass('hidden');
    };

    $scope.login = function($event){
      	$scope.spin($event);

        var username = $scope.username.trim().toUpperCase();

        app.el.Users.login(username, // username
            $scope.password, // password
            function (data) {
                 app.PushRegistrar.enablePushNotifications(username);
                 app.application.navigate("#main", "slide:left");
            },
            function(error){
                $scope.stop($event);
                if (error.code === 205)
                    $scope.message = "Incorrect";
                else
                    $scope.message = "Login Failed";
                window.setTimeout(function(){
                    $scope.message = app.TAP_TO_LOGIN;
                    $scope.$apply();
                }, 1000);
                console.log(JSON.stringify(error));
                $scope.$apply();
            });
    };

    $scope.home = function(){
		 app.application.navigate("#home", "slide:right");
    };
}
