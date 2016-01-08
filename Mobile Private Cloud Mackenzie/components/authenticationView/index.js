'use strict';

app.authenticationView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_authenticationView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_authenticationView
(function(parent) {
    var provider = app.data.mobilePrivateCloudMackenzie,
        mode = 'signin',
        registerRedirect = 'home',
        signinRedirect = 'home',
        init = function(error) {
            if (error) {
                if (error.message) {
                    alert(error.message);
                }
                return false;
            }

            var activeView = mode === 'signin' ? '.signin-view' : '.signup-view';

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }
        },
        successHandler = function(data) {
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect;

            if (data && data.result) {
                app.user = data.result;

                setTimeout(function() {
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                init();
            }
        },
        authenticationViewModel = kendo.observable({
            displayName: '',
            tia: '',
            email: '',
            password: '',
            validateData: function(data) {
                if (!data.tia) {
                    alert('Missing TIA');
                    return false;
                }

                if (!data.password) {
                    alert('Missing password');
                    return false;
                }

                return true;
            },
            signin: function() {
                var model = authenticationViewModel,
                    TIA = model.tia,
                    email = model.email.toLowerCase(),
                    password = model.password;

                if (!model.validateData(model)) {
                    return false;
                }
                provider.Users.login(TIA, password, successHandler, init);
            },
            register: function() {
                var model = authenticationViewModel,
                    TIA = model.tia,
                    email = model.email.toLowerCase(),
                    password = model.password,
                    displayName = model.displayName,
                    attrs = {
                        Email: email,
                        DisplayName: displayName
                    };

                if (!model.validateData(model)) {
                    return false;
                }

                provider.Users.register(TIA, password, attrs, successHandler, init);
            },
            toggleView: function() {
                mode = mode === 'register' 
                init();
            }
        });

    parent.set('authenticationViewModel', authenticationViewModel);
    parent.set('afterShow', function() {
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.authenticationView);


// START_CUSTOM_CODE_authenticationViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


// END_CUSTOM_CODE_authenticationViewModel