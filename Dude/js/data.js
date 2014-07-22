(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.refreshFriendsList = function(){
      app.el.Users.currentUser()
          .then(function (data) {
            console.log(data);
            var result = data.result;
            if(result != null){
                var data = app.el.data('Friends');
                
                console.log(result.Id);

                data.get({ 'UserId': result.Id})
                  .then(function(data){
                    var result = data.result;
                   
                    if (result != null){
                      var list = JSON.parse(result.Data);
                      for (var index = 0; index < list.length; index++){
                          app.dataSource.push(list[index]);
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
        app.el.Users.currentUser()
          .then(function(data){
            var data = app.el.data('Friends');
              
            data.get({UserId:data.result.Id})
            .then(function(friends){
              if (friends.length > 0){
                data.update({'Data': JSON.stringify(app.dataSource.data())},
                  {'UserId': data.result.Id},
                  function(data){
                       console.log(JSON.stringify(data));
                  },
                  function(error){
                      console(JSON.stringify(error));
                  });
              }else{
                 data.create({
                     'Data': JSON.stringify(app.dataSource.data()),
                     'UserId': data.result.Id
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
          }
      },
      function(error){
           
      });
    }

})(window);
