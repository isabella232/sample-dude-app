(function (global) {

    var app = global.app = global.app || {};

    var everlive = {
       apiKey: 'y4amUffZpy1LsFYg',
       scheme: 'http'
  	};

    app.el = new Everlive(everlive.apiKey);

   	app.TAP_TO_SIGNUP = "Tap to Signup";
    app.TAP_TO_LOGIN = "Tap to Login";

    document.addEventListener('deviceready', function () {

      navigator.splashscreen.hide();

      StatusBar.overlaysWebView(true);
      StatusBar.hide();

      Keyboard.hideFormAccessoryBar(true);

      app.application = new kendo.mobile.Application(document.body, {});

      app.spinner = new Spinner({color:"#fff", width:3, className:'spin'}).spin();

      app.dataSource = new kendo.data.DataSource({
          data :[{
            name : "+"
          }]
      });

      app.pushSettings = {
          iOS: {
              badge: "true",
              sound: "true",
              alert: "true"
          },
          notificationCallbackIOS: function(e){

              var initialized = false;

              for (var index = 0; index < app.dataSource.total(); index++){
                  if (app.dataSource.at(index).name === e.alert){
                    initialized = true;
                  }
              }

              if (!initialized){
                app.dataSource.insert(0, {name: e.alert});
                app.requests.push(e.alert);
              }
          }
      };

      app.loader = function(el){
        var loader = $(el).next();

        if (loader.find('.spin').length == 0)
          loader.append(app.spinner.el);

          return loader;
      };

      $(document).on('click', 'a[href="/dude"]', function(e){

        var username = $(e.target).text().trim();
	    var loader =  app.loader(e.target);

        if (!$(e.target).hasClass('hidden')){
           $(e.target).addClass('hidden');
        }

        loader.show();

        var notification = {
              "Filter":  "{ \"Parameters.Username\" : \"" + username.toUpperCase() + "\"}",
              "IOS": {
                "aps": {
                    "alert": app.username,
                    "sound": "default"
              }
            }
        };

        var url = "http://api.everlive.com/v1/" + app.everlive.apiKey + "/Push/Notifications";

        $.post(url, notification).done(function(result){
            loader.hide();

            $(e.target).text("Sent!");
            $(e.target).removeClass('hidden');

            window.setTimeout(function(){
                $(e.target).text(username);
            }, 1000);
        });

        return false;
      });


      $(document).on('keypress', 'input[id="newuser"]', function(e){
        if (e.which == 13){
              var loader =  app.loader(e.target);

              var username = $(e.target).val();
              var filter = new Everlive.Query();

              filter.where().eq('Username', username.toUpperCase());

              var data = app.el.data('Users');

              if (!$(e.target).hasClass('hidden')){
                 $(e.target).addClass('hidden');
              }

              $(e.target).blur();
              loader.show();

              data.get(filter)
                  .then(function(data){
                      $(e.target).removeClass('hidden');
                      if (data.count == 1){
                          app.updateFriendsList();
                          
                          app.dataSource.insert(0, {
                            name: username
                          });

                          $(e.target).val("");
                      }else{
                          $(e.target).val("Invalid User");
                          window.setTimeout(function(){
                              $(e.target).val("");
                          }, 1000);
                      }
                      loader.hide();
                  },
                  function(error){
                      $(e.target).removeClass('hidden');
                      $(e.target).val("Invalid User");
                      window.setTimeout(function(){
                          $(e.target).val("");
                      }, 1000);
                      loader.hide();
                  });
          }
      });

    }, false);

})(window);
