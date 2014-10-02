(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.PushRegistrar = (function () {
        var _onDeviceIsSuccessfullyInitialized = function () {
            console.log("The device is succcessfully initialized for push notifications.");
            console.log("Push token received!");
            console.log("Verifying device registration...");
        }
        var _onDeviceIsSuccessfullyRegistered = function () {
            console.log("Device is successfully registered in Backend Services.");
            console.log("You can receive push notifications.");
        };

        var _onDeviceIsAlreadyRegistered = function () {
            console.log("Device is already registered in Telerik Backend Services.");
            console.log("Updating the device registration...");
        };

        var _onDeviceIsNotInitialized = function(){
            console.log("Device removed");
        }

        var _onDeviceIsNotRegistered = function () {
            console.log("Device is not registered in Backend Services.");
            console.log("Registering the device in Backend Services...");
        };

        var _onDeviceRegistrationUpdated = function () {
            console.log("Successfully updated the device registration.");
        };

        var _onPushErrorOccurred = function (message) {
            console.log("Error: " + message, true);
        };

        var onAndroidPushReceived = function (e) {
            // nothing here
        };

        var onIosPushReceived = function (e) {
        	 alert('iOS notification received: ' + JSON.stringify(args));
        };

        var enablePushNotifications = function (username) {
            var currentDevice =  app.el.push.currentDevice(false);
            app.username = username.toUpperCase();

            var customDeviceParameters = {
                Username : username
            };

            currentDevice.enableNotifications(app.pushSettings)
                  .then(
                      function (initResult) {
                        _onDeviceIsSuccessfullyInitialized();

                        return currentDevice.getRegistration()
                    },
                    function (err) {
                        _onPushErrorOccurred(err.message);
                    }).then(
                      function(registration){
                                    app.el.push.currentDevice().updateRegistration(customDeviceParameters)
                          then(
                            function (regData) {
                                _onDeviceIsSuccessfullyRegistered();
                            }, function (err) {
                                _onPushErrorOccurred(err.message);
                            });

                      },function(err){
                          if (err.code === 801){
                            app.el.push.currentDevice().register(customDeviceParameters)
                              then(
                                function (regData) {
                                    _onDeviceRegistrationUpdated();
                                }, function (err) {
                                    _onPushErrorOccurred(err.message);
                                });
                          }
                          _onPushErrorOccurred(err.message);
                      });
        };
        var disablePushNotifications = function() {
            app.el.push.currentDevice()
                .disableNotifications()
                .then(
                    _onDeviceIsNotInitialized,
                    function(err) {
                        console.log('UNREGISTER ERROR: ' + JSON.stringify(err));
                    }
                );
        };
        return {
            enablePushNotifications : enablePushNotifications,
            disablePushNotifications: disablePushNotifications
        }
    })();
})(window);
