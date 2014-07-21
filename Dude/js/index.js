(function (global) {

    var app = global.app = global.app || {};

    app.everlive = {
       apiKey: 'y4amUffZpy1LsFYg',
       scheme: 'http'
  	};

   	app.TAP_TO_SIGNUP = "Tap to Signup";
    app.TAP_TO_LOGIN = "Tap to Login";

    document.addEventListener('deviceready', function () {
      StatusBar.hide();

      navigator.splashscreen.hide();

      app.application = new kendo.mobile.Application(document.body, {});

      app.spinner = new Spinner({color:"#fff", width:3, className:'spin'}).spin();

      app.dataSource = new kendo.data.DataSource({
          data :[{
            name : "+"
          }]
      });

      app.loader = function(el){
        var loader = $(el).next();

        if (loader.find('.spin').length == 0)
          loader.append(app.spinner.el);
          
          return loader;
      };

      $(document).on('click', 'a[href="/dude"]', function(e){
	    var username = $(e.target).val();
          
        var loader =  app.loader(e.target);

        if (!$(e.target).hasClass('hidden')){
           $(e.target).addClass('hidden');
        }

        loader.show();
          
        var el = new Everlive(app.everlive.apiKey);
          
        el.push.notifications.create({ 
            	Message:'Dude',
            	Filter: "{\"Parameters.Username\":\"" + username + "\"}"
        	},
            function(data){
                loader.hide();
                
                $(e.target).val("Sent!");
                $(e.target).removeClass('hidden');
                    
                window.setTimeout(function(){
                 	$(e.target).val(username);
                }, 1000);
            },
            function(error){
                appConsole.log(JSON.stringify(error));
            });

        return false;
      });

      $(document).on('keypress', 'input[id="newuser"]', function(e){
        if (e.which == 13){
              var loader =  app.loader(e.target);

              var el = new Everlive(app.everlive.apiKey);

              var username = $(e.target).val();
              var filter = new Everlive.Query();

              filter.where().eq('Username', username.toUpperCase());

              var data = el.data('Users');

              if (!$(e.target).hasClass('hidden')){
                 $(e.target).addClass('hidden');
              }

              $(e.target).blur();
              loader.show();

              data.get(filter)
                  .then(function(data){
                      $(e.target).removeClass('hidden');
                      if (data.count == 1){
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
