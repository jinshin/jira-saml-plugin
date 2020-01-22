AJS.$(function() {
    setTimeout(function() {
        if (AJS.$("#login-form").length) {
            loadCorpLogin(AJS.$("#login-form"));
        } else if (AJS.$("#loginform").length) {
            loadCorpLogin(AJS.$("#loginform"));
        } else {
            AJS.$("iframe").ready(function() {

                var iframe = AJS.$("#gadget-0")
                iframe.load(function() {
                    loginForm = AJS.$("#" + iframe[0].id).contents().find("#loginform")
                    loadCorpLogin(loginForm);
                });
            });
        } // Your code here
    }, 0);

    function loadCorpLogin(loginForm) {
        if (loginForm.length == 1) {
            loginFormId = loginForm[0].id
            loginForm.hide();

            if (loginFormId == "login-form" || loginFormId == "loginform") {
                AJS.$('<div class="field-group"><a class="aui-button aui-style aui-button-primary" href="' + AJS.contextPath() + '/plugins/servlet/saml/auth" style="align:center;">Fraglab SSO Login</a></div><h2 style="margin-top:10px"></h2>').insertBefore(AJS.$("#" + loginFormId + " .field-group:first-child"));
            } else {
                AJS.$('<div class="field-group"><a class="aui-button aui-style aui-button-primary" href="' + AJS.contextPath() + '/plugins/servlet/saml/auth" style="margin-left:100px;margin-top:5px;">Fraglab SSO Login</a></div>').insertBefore(AJS.$("#gadget-0"));
            }

            var query = location.search.substr(1);
            query.split("&").forEach(function(part) {
                var item = part.split("=");
                if (item.length == 2 && item[0] == "samlerror") {
                    var errorKeys = {};
                    errorKeys["general"] = "General SAML configuration error";
                    errorKeys["user_not_found"] = "User was not found";
                    errorKeys["plugin_exception"] = "SAML plugin internal error";
                    loginForm.show();
                    var message = '<div class="aui-message closeable error">' + errorKeys[item[1]] + '</div>';
                    AJS.$(message).insertBefore(loginForm);
                }
            });

            if (location.search == '?logout=true') {
                $.ajax({
                    url: AJS.contextPath() + "/plugins/servlet/saml/getajaxconfig?param=logoutUrl",
                    type: "GET",
                    error: function() {},
                    success: function(response) {
                        if (response != "") {
                            AJS.$('<p>Please wait while we redirect you to your company log out page</p>').insertBefore(loginForm);
                            window.location.href = response;
                            return;
                        }
                    }
                });
                return;
            }

            AJS.$.ajax({
                url: AJS.contextPath() + "/plugins/servlet/saml/getajaxconfig?param=idpRequired",
                type: "GET",
                error: function() {},
                success: function(response) {
                    if (response == "true") {
                        // AJS.$('<img src="download/resources/com.bitium.confluence.SAML2Plugin/images/progress.png"/>').insertBefore(AJS.$(".aui.login-form-container"));
                        AJS.$('<p>Please wait while we redirect you to your company log in page</p>').insertBefore(loginForm);
                        window.location.href = AJS.contextPath() + '/plugins/servlet/saml/auth';

                    } else {
                        loginForm.show();
                    }
                }
            });

        }
    }

});
