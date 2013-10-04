define([
    'localstorage'
],
    function (Localstorage) {
        var CalendarCollection = Backbone.Collection.extend({

            url: function(){
            	var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/Persons";
                
                return url;
            },
           
            initialize: function(){
                var hash = Localstorage.getFromLocalStorage('hash'),
            		uid = Localstorage.getFromLocalStorage('uid'),
            		mid = 39;
                this.fetch({
                    data: $.param({
                		uid: uid,
                		hash: hash,
                		mid: mid
                	}),
                    reset:true
                });
            },
            
            parse:true,

            parse: function (response) {
                return response.data;
            }
        });

        return CalendarCollection;
    });