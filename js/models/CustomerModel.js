define(function ($, _, Backbone) {
        var CustomerModel = Backbone.Model().extend({
            url: function(){
                if(this.get('isCompany')){
                    return "http://" + App.Server.ip + ":" + App.Server.port + "/createAccount";
                }else{
                    return "http://" + App.Server.ip + ":" + App.Server.port + "/createCompany";
                }
            },

            initialize: function(){

            }
        });

        return CustomerModel;
    });