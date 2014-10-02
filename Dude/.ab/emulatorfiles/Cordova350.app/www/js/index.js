(function (global) {

    var app = global.app = global.app || {};


    var everlive = {
       apiKey: 'y4amUffZpy1LsFYg',
       scheme: 'http'
  	};

    app.el = new Everlive(everlive.apiKey);

   	app.TAP_TO_SIGNUP = "Tap to Signup";
    app.TAP_TO_LOGIN = "Tap to Login";

    app.inviteText = "";

    app.loader = function(el){
      var loader = $(el).next();

      if (loader.find('.spin').length == 0)
        loader.append(app.spinner.el);

        return loader;
    };

    app.events = {
        tap: function(e) {
          // // make sure the initial touch wasn't on the archive button
          var target = e.touch.currentTarget;

          var username = target.innerText.trim();
          var loader =  app.loader(target);

          if (!$(target).hasClass('hidden')){
             $(target).addClass('hidden');
          }

          loader.show();

          var notification = {
                "Filter":  "{ \"Parameters.Username\" : \"" + username.toUpperCase() + "\"}",
                "IOS": {
                  "aps": {
                      "alert": app.username,
                      "sound": "/www/dude.wav"
                }
              },
              "Android": {
                  "data": {
                      "title": "Dude",
                      "message": app.username,
                      "time_to_live": "0",
                      "delay_while_idle" : "false",
                      "collapse_key" : app.username,
                      "soundname": "/assets/www/dude.wav"
                  }
              }
          };

          var url = "http://api.everlive.com/v1/" + everlive.apiKey + "/Push/Notifications";

          $.post(url, notification).done(function(result){
              loader.hide();

              $(target).text("Sent!");
              $(target).removeClass('hidden');

              window.setTimeout(function(){
                  $(target).text(username);
              }, 1000);
          }, function(err){

          });
        }
      };

    document.addEventListener('deviceready', function () {

      StatusBar.overlaysWebView(true);
      StatusBar.hide();
      if (typeof Keyboard !== 'undefined'){
        Keyboard.hideFormAccessoryBar(true);
      }

      app.initData = function(){
          app.dataSource = new kendo.data.DataSource({
              data :[]
          });
      };

      app.application = new kendo.mobile.Application($(document.body), {
        statusBarStyle: "hidden"
      });

      app.initData();

      app.spinner = new Spinner({color:"#fff", width:3, className:'spin'}).spin();

      function initializeDb(callback){
         if (window.cblite){
           window.cblite.getURL(function(err, url){
             if (!err){
                app.cbLiteUrl = url;
                $.get(app.cbLiteUrl + 'user').done(function(result){
                    callback();
                }).fail(function(err){
                    if (err.status === 404){
                      $.ajax({
                        url : app.cbLiteUrl + 'user',
                        type: 'PUT'
                      }).done(function(result){
                          if (result.ok){
                             callback();
                          }
                      }).fail(function(err){
                          alert(JSON.stringify(err));
                      });
                    }
                });
              }
           });
         }
        };

       initializeDb(function(){
          $.get(app.cbLiteUrl + 'user/_all_docs').done(function(result){
              if (result.rows.length > 0){
                $.get(app.cbLiteUrl + 'user/' + result.rows[0].id).done(function(result){
                    if (result){
                        app.username = result.username;
                        app.application.navigate("#main", "slide:left");
                    }
                }).fail(function(err){
                   navigator.splashscreen.hide();
                });
              }
              else{
                  navigator.splashscreen.hide();
              }
          });
       });

      app.notificationCallback = function(notification){

        var initialized = false;

        for (var index = 0; index < app.dataSource.total(); index++){
            if (app.dataSource.at(index).name.toLowerCase() === notification.alert.toLowerCase()){
              initialized = true;
            }
        }

        if (!initialized && app.username.toUpperCase() !== notification.alert.trim()){
          app.dataSource.insert(0, {name: notification.alert.trim().toUpperCase()});
          app.Data.updateFriendsList();
        }

        var media =  new Media(notification.sound);

        media.play();
      }

      app.pushSettings = {
          iOS: {
              badge: "true",
              sound: "true",
              alert: "true"
          },
          android:{
              senderID:"895584377110"
          },
          notificationCallbackAndroid: function(e){
            var soundfile = e.soundname || e.payload.sound;
            app.notificationCallback({
              alert : e.message,
              sound : soundfile
            });
          },
          notificationCallbackIOS: function(e){
            app.notificationCallback({
              alert: e.alert,
              sound: e.sound
            });
          }
      };


      $(document).on('click', 'a[href="/invite"]', function(e){
          navigator.contacts.pickContact(function(contact){
                window.setTimeout(function(){
                    var to = contact.name.formatted;

                    if (contact.phoneNumbers != null && contact.phoneNumbers.length > 0){
                        to = contact.phoneNumbers[0].value;
                    }

                    var messageInfo = {
                      phoneNumber: to,
                      textMessage: app.inviteText
                    };

                    sms.sendMessage(messageInfo, function(message) {
                      console.log("success: " + message);
                    }, function(error) {
                      navigator.notification.alert(error.message, null, "Dude");
                    });
                }, 500);
            });

          return false;
      });

      $(document).on('click', 'a[href="/logoff"]', function(e){
          app.initData();
          app.PushRegistrar.disablePushNotifications();

          var docUrl = app.cbLiteUrl + 'user/' + app.username;

          $.get(docUrl).done(function(result){
            $.ajax({
                url : docUrl + '?rev=' + result._rev,
                type: 'DELETE',
            }).done(function(result){
                app.application.navigate("#home", "slide:right");
            }).fail(function(err){
                alert(JSON.stringify(err));
            });
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

                          var found = false;

                          for (var index = 0; index < app.dataSource.data().length; index++){
                              if (username.toUpperCase() ===  app.dataSource.data()[index].name.toUpperCase()){
                                found = true;
                              }
                          }
                          if (!found){
                            app.dataSource.insert(0, {
                              name: username
                            });
                            app.Data.updateFriendsList();
                          }
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
