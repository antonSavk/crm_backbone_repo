define([
    'localstorage'
],
    function (Localstorage) {
        var MyModel = Backbone.Model.extend({
            //idAttribute: '_id'
        });
         
        var MenuItems = Backbone.Collection.extend({
            model: MyModel,
            url: function () {
                 
                return "http://" + App.Server.ip + ":" + App.Server.port + "/getModules"
            },

            setCurrentModule: function(moduleName){
                this.currentModule = moduleName;
                this.trigger('change:currentModule',this.currentModule, this);
            },

            currentModule: "HR",

            initialize: function () {
               

                console.log("init collection");
                var hash = Localstorage.getFromLocalStorage('hash'),
                    uid = Localstorage.getFromLocalStorage('uid');

                this.fetch({
                    data: $.param({
                        hash: hash,
                        uid: uid
                    }),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });


            },
            
            parse:true,

            parse: function (response) {
                
                console.log('parse');
                $.each(response.data, function(index,val){
                    response.data[index]["id"] = response.data[index]["_id"];
                    delete response.data[index]["_id"];
                });
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("fetchSuccess");
                collection.relationships();


            },

            fetchError: function(collection, response){
                throw new Error("Not collection received from fetch");
            },

            relationships: function(){
                this.relations = _.groupBy(this.models, this.parent);
            },

            root: function(){
                if(!this.relations) this.relationships();
                return this.relations[0];
            },

            getRootElements: function(){
                var model = Backbone.Model.extend({});
                if(!this.relations) this.relationships();
                return $.map(this.relations[0],function(current){
                    return new model({
                        id:current.get('id'),
                        mname:current.get('mname')
                    });
                });
            },

            children: function(model){

                if(!this.relations) this.relationships();
                return (typeof this.relations[model["id"]] === 'undefined') ? [] : this.relations[model["id"]];
            },

            parent: function(model){
                var parrent = model.get('parrent');
                return (!parrent) ? 0 : parrent;
            }
        });

        return MenuItems;
    });