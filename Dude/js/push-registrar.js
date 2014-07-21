(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.PushRegistrar = (function () {
        var _onDeviceIsSuccessfullyInitialized = function () {
            appConsole.log("The device is succcessfully initialized for push notifications.");
            appConsole.log("Push token received!");
            appConsole.log("Verifying device registration...");
        }
        var _onDeviceIsSuccessfullyRegistered = function () {
            appConsole.log("Device is successfully registered in Backend Services.");
            appConsole.log("You can receive push notifications.");
        };

        var _onDeviceIsAlreadyRegistered = function () {
            appConsole.log("Device is already registered in Telerik Backend Services.");
            appConsole.log("Updating the device registration...");
        };

        var _onDeviceIsNotRegistered = function () {
            appConsole.log("Device is not registered in Backend Services.");
            appConsole.log("Registering the device in Backend Services...");
        };

        var _onDeviceRegistrationUpdated = function () {
            appConsole.log("Successfully updated the device registration.");
        };

        var _onPushErrorOccurred = function (message) {
            appConsole.log("Error: " + message, true);
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

        var enablePushNotifications = function () {
            var el = new Everlive(app.everlive.apiKey);
            var currentDevice =  el.push.currentDevice();
            
            var customDeviceParameters = {
                Username : app.username
            };

            currentDevice.enableNotifications(pushSettings)
                .then(
                    function (initResult) {
                        _onDeviceIsSuccessfullyInitialized();

                        return currentDevice.getRegistration();
                    },
                    function (err) {
                        _onPushErrorOccurred(err.message);
                    }
                    ).then(
                        function (registration) {
                            _onDeviceIsAlreadyRegistered();

                            currentDevice
                                .updateRegistration(customDeviceParameters)
                                .then(function () {
                                    _onDeviceRegistrationUpdated();
                                }, function (err) {
                                    _onPushErrorOccurred(err.message);
                                });
                        },
                        function (err) {
                            if (err.code === 801) {
                                _onDeviceIsNotRegistered();

                                currentDevice.register(customDeviceParameters)
                                    .then(function (regData) {
                                        _onDeviceIsSuccessfullyRegistered();
                                    }, function (err) {
                                        _onPushErrorOccurred(err.message);
                                    });
                            }
                            else {
                                _onPushErrorOccurred(err.message);
                            }
                        }
                        );
        };
        return {
            enablePushNotifications : enablePushNotifications
        }
    })();
})(window);