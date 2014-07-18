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
    
    }, false);    
 
})(window);