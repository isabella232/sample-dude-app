function MainController($scope, $http, $location){

 $scope.addUser = function($event){
   console.log($event.keycode);
   console.log("here");

   app.dataSoruce.insert(0, { name : "Test" });

   $($event.target).val("");
 };

}
