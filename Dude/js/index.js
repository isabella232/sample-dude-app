(function (global) {
    
  var app = global.app = global.app || {};
  
  document.addEventListener('deviceready', function () {
      StatusBar.hide();
       
      navigator.splashscreen.hide();
        
      app.application = new kendo.mobile.Application(document.body, {});
  
  }, false);

})(window);