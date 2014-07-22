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

})(window);
