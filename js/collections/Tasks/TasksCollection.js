define([
    'localstorage'
],
    function (Localstorage) {
        var TaskModel = Backbone.Model.extend({
            idAttribute: '_id'
        });

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
                console.log("Task Collection Init");

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
            	console.log('parse Tasks');
                //$.each(response.data, function(index,val){
                //    response.data[index]["id"] = response.data[index]["_id"];
                //    delete response.data[index]["_id"];
                //});
                return response.data;
            },

            fetchSuccess: function (collection, response) {
                console.log("Tasks fetchSuccess");
                /*if (options.success) {
                    options.success(result);
                }*/
            },
            fetchError: function (error) {

            }


        });

        return TasksCollection;
    });