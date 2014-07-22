(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.refreshFriendsList = function(){
      app.el.Users.currentUser()
          .then(function (user) {
            var result = user.result;
            if(result != null){
                var data = app.el.data('Friends');

                data.get({ 'UserId': result.Id})
                  .then(function(data){
                    if (data.result.length > 0){
                      var list = JSON.parse(data.result[0].Data);
                      for (var index = list.length -1; index >= 0;index--){
                          app.dataSource.insert(0, list[index]);
                      }
                    }
                  },
                  function(error){
                    console.log(JSON.stringify(error));
                });
            }
          },
          function(error){
              alert(JSON.stringify(error));
          });
    };

    app.updateFriendsList = function(){

        var list = [];
        for (var index = 0; index < app.dataSource.data().length; index++){
            if (app.dataSource.data()[index].name != '+'){
              list.push(app.dataSource.data()[index]);
            }
        }

        app.el.Users.currentUser()
          .then(function(user){
            var data = app.el.data('Friends');

            data.get({UserId:user.result.Id})
            .then(function(friends){
              if (friends.count > 0){
                data.update({'Data': JSON.stringify(list)},
                  {'UserId': user.result.Id},
                  function(data){
                       console.log(JSON.stringify(data));
                  },
                  function(error){
                      console(JSON.stringify(error));
                  });
              }else{
                 data.create({
                     'Data': JSON.stringify(list),
                     'UserId': user.result.Id
                 },
                 function(data){
                     console.log(JSON.stringify(data));
                 },
                 function(error){
                      console(JSON.stringify(error));
                 });
              }
            },function(error){
            	console.log(JSON.parse(error));
            });
          },
          function(error){
               console.log(JSON.parse(error));
          });
    };

})(window);
