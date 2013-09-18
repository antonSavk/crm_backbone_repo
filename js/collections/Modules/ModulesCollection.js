define([
    'localstorage'
],
    function (Localstorage) {
        var MenuItems = Backbone.Collection.extend({

            url: function(){
                return "http://" + App.Server.ip + ":" + App.Server.port + "/getModules"
            },
            initialize: function(){
                var hash = Localstorage.getFromLocalStorage('hash'),
                    uid = Localstorage.getFromLocalStorage('uid');

                this.fetch({
                    data: $.param({
                        uid: uid,
                        hash: hash
                    }),
                    reset:true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },
            parse:true,

            parse: function(response){
                return response.data;
            },

            fetchSuccess: function(collection, response){
            },
            fetchError: function(error){
            }
        });

        return MenuItems;
    });