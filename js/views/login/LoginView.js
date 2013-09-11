define([
    'text!templates/login/LoginTemplate.html',
    'custom',
    'communication'
], function(LoginTemplate, Custom, Communication){

    var LoginView = Backbone.View.extend({
        el: '#wrapper',
        initialize: function(){
            this.render();
        },
        events: {
        	"submit #loginForm": "login"
        },
        render: function(){
            this.$el.html(LoginTemplate);
            return this;
        },
        login: function(event){
        	event.preventDefault();
        	var data = {
        			ulogin: this.$("#ulogin").val(),
        			upass: this.$("#upass").val()
        	};
        	var url = "http://" + App.Server.ip + ":" + App.Server.port + "/login";
                $.ajax({
                    url: url,
                    type:"POST",
                    data:{
                        ulogin: data.ulogin,
                        upass: data.upass
                    },
                    success: function (resp) {
                        
                    	if (resp.result.status == 0)
                    	{
                    		LocalStorage.saveToLocalStorage('uid', resp.data._id);
                        	LocalStorage.saveToLocalStorage('hash', resp.hash);
                        	callback(true);
                    	}else
                    		callback(false, resp.result.description);
                    },
                    error: function(){
                        callback(false, "Server is unavailable...");
                    }
                });
        	Communication.checkLogin(data, Custom.runApplication);
        }
    });

    return LoginView;

});