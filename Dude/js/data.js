(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    var el = new Everlive(app.everlive.apiKey);

    app.refreshFriendsList = function(userId){
	  console.log(userId);
      var data = el.data('Friends');

      var filter = {
          'UserId': userId
      };

      data.get(filter)
        .then(function(data){
          if (data != null){
            var list = JSON.parse(data.Data);

             console.log(list);

            for (var index = 0; index < list.length; index++){
                app.dataSource.push(list[index]);
            }
          }
        },
        function(error){
          console.log(JSON.stringify(error));
        });
    };

    app.updateFriendsList = function(){
        el.Users.currentUser()
          .then(function(data){
            var data = el.data('Friends');
            
            console.log(JSON.parse(app.dataSource));

            // data.update({ 'Data': JSON.string }, // data
            //     { 'Author': 'Sample Text' }, // filter
            //     function(data){
            //         alert(JSON.stringify(data));
            //     },
            //     function(error){
            //         alert(JSON.stringify(error));
            //     });

          }, function(error){
            console.log(JSON.parse(error));
          });
    }

})(window);
