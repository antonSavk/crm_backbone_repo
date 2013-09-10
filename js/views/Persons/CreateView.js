define([
    "text!templates/Persons/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Persons/PersonsCollection",
    "models/PersonModel",
    "localstorage"
],
    function (CreateTemplate, CompaniesCollection, PersonsCollection, PersonModel, LocalStorage) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Persons",
            template: _.template(CreateTemplate),

            initialize: function (options) {
               this.companiesCollection = new CompaniesCollection();
               this.companiesCollection.bind('reset', _.bind(this.render,this));
               this.personsCollection = options.collection;


               this.bind('reset', _.bind(this.render, this));
               this.render();
            },


            saveItem: function(){
            	var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                var data = {
                    name:{
                      first:$('#firstName').val(),
                      last:$('#lastName').val()
                    },
                    company:{
                        id: $('#companiesDd option:selected').val(),
                        name: $('#companiesDd option:selected').text()
                    },
                    address:{
                        street1: $('#addressInput').val(),
                        street2: $('#additional').val(),
                        city: $('#cityInput').val(),
                        state: $('#stateInput').val(),
                        zip: $('#zipInput').val(),
                        country: $('#countryInput').val()
                    },
                    website: $('#websiteInput').val(),
                    jobPosition: $('#jobPositionInput').val(),
                    phones: {
                        phone: $('#phoneInput').val(),
                        mobile: $('#mobileInput').val(),
                        fax: $('#faxInput').val()
                    },
                    email:$('#emailInput').val(),
                    salesPurchases:{
                        isCustomer: $('#isCustomerInput').is(':checked'),
                        isSupplier: $('#isSupplierInput').is(':checked'),
                        active: $('#isActiveInput').is('checked')
                    }

                };

                var model = new PersonModel();
                model.save(data,{
                    headers:{
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                });

                /*this.personsCollection.create(
                    data,
                    {
                	headers: {
            			uid: uid,
            			hash: hash,
            			mid: mid
            		}
                });*/

                Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
                
            },

            render: function () {
                this.$el.html(this.template({companiesCollection:this.companiesCollection}));
                return this;
            }

        });

        return CreateView;
    });