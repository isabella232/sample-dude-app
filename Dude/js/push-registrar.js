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
        	// nothing here.
        };

        var pushSettings = {
          	iOS: {
                badge: "false",
                sound: "true",
                alert: "true"
            },
            notificationCallbackIOS: onIosPushReceived
        };

        var enablePushNotifications = function (username) {
            var el = new Everlive(app.everlive.apiKey);
            var currentDevice =  el.push.currentDevice(false);

            var customDeviceParameters = {
                Username : username
            };

            currentDevice.enableNotifications(pushSettings)
                  .then(
                      function (initResult) {
                        _onDeviceIsSuccessfullyInitialized();

                        return currentDevice.getRegistration()
                    },
                    function (err) {
                        _onPushErrorOccurred(err.message);
                    }).then(
                      function(registration){
                        el.push.currentDevice().updateRegistration(customDeviceParameters)
                          then(
                            function (regData) {
                                _onDeviceIsSuccessfullyRegistered();
                            }, function (err) {
                                _onPushErrorOccurred(err.message);
                            });

                      },function(err){
                          if (err.code === 801){
                            el.push.currentDevice().register(customDeviceParameters)
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
        return {
            enablePushNotifications : enablePushNotifications
        }
    })();
})(window);
