define([
    "text!templates/Users/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Profiles/ProfilesCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, CompaniesCollection,ProfilesCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Users",

            initialize: function (options) {
                this.collection = options.collection;
                this.profilesCollection = new ProfilesCollection();
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
            },

            saveItem: function(){
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1)
                {
                    var currentModel = this.collection.models[itemIndex];
                    var hash = LocalStorage.getFromLocalStorage('hash'),
                        uid = LocalStorage.getFromLocalStorage('uid'),
                        mid = 39;

                    var data = {

                    };
                    currentModel.set(data);
                    currentModel.save({}, {
                        headers: {
                            uid: uid,
                            hash: hash,
                            mid: mid
                        }
                    });
                    Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
                }
            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1)
                { this.$el.html(); }
                else
                {
                    var currentModel = this.collection.models[itemIndex];
                    /*console.log(currentModel.get('profile').company.id + " " + currentModel.get('profile').company.name);
                    for(var i=0; i<this.companiesCollection.length; i++){
                        console.log(this.companiesCollection.models[i].get('id') + " " + this.companiesCollection.models[i].get('cname'));
                    }*/
                    this.$el.html(_.template(EditTemplate, {model: currentModel.toJSON(),
                        companiesCollection:this.companiesCollection,
                        profilesCollection:this.profilesCollection }));
                }
                return this;
            }

        });

        return EditView;
    });