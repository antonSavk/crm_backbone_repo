define([
    'models/TaskModel',
    'localstorage'
],
    function (TaskModel, Localstorage) {
        var TasksCollection = Backbone.Collection.extend({
            model: TaskModel,
            url: function () {
                var hash = Localstorage.getFromLocalStorage('hash'),
                       uid = Localstorage.getFromLocalStorage('uid'),
                       mid = 39,
                       url = "http://" + App.Server.ip + ":" + App.Server.port + "/Tasks";
                return url;
            },

            initialize: function () {
                var hash = Localstorage.getFromLocalStorage('hash'),
                   uid = Localstorage.getFromLocalStorage('uid'),
                   mid = 39;

                this.fetch({
                    data: $.param({
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse: true,

            parse: function(response){
                return response.data;
            },

            fetchSuccess: function (collection, response) {
            },
            fetchError: function (error) {
            }
        });

        return TasksCollection;
    });