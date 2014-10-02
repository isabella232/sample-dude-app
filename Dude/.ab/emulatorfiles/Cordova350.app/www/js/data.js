(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.Data = (function () {

      var currentUser = function(callback){
        $.get(app.cbLiteUrl + 'user/_all_docs').done(function(result){
            if (result.rows.length > 0){
                $.get(app.cbLiteUrl + 'user/' + result.rows[0].id).done(function(result){
                    callback(result);
                });
            }
        });
      };

      var refreshFriendsList = function(callback){
          currentUser(function(user){
                if(user !== null){
                    var data = app.el.data('Friends');

                    data.get({ 'UserId': user.uid})
                      .then(function(data){
                        if (data.result.length > 0){
                          var list = JSON.parse(data.result[0].Data);
                          for (var index = list.length -1; index >= 0;index--){
                              app.dataSource.insert(0, list[index]);
                          }
                        }
                        callback();
                      },
                      function(error){
                        console.log(JSON.stringify(error));
                    });
                }
          });
        };

        var updateFriendsList = function(){
            currentUser(function(user){
                var list = [];
                for (var index = 0; index < app.dataSource.data().length; index++){
                      list.push(app.dataSource.data()[index]);
                }

                var data = app.el.data('Friends');

                data.get({UserId:user.uid})
                .then(function(friends){
                  if (friends.count > 0){
                    data.update({'Data': JSON.stringify(list)},
                      {'UserId': user.Id},
                      function(data){
                           console.log(JSON.stringify(data));
                      },
                      function(error){
                          console(JSON.stringify(error));
                      });
                  }else{
                     data.create({
                         'Data': JSON.stringify(list),
                         'UserId': user.uid
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
            });
        };

        return {
            refreshFriendsList : refreshFriendsList,
            updateFriendsList  : updateFriendsList,
            currentUser : currentUser
        }
    })();

})(window);
