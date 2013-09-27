define([
    "text!templates/Companies/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "models/CompanyModel",
    "localstorage",
    "custom"
],
    function (CreateTemplate, CompaniesCollection, CompanyModel, LocalStorage, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            template: _.template(CreateTemplate),

            initialize: function (options) {
               this.companyCollection = options.collection;
               this.render();
            },

            close: function(){
                this._modelBinder.unbind();
            },

            saveItem: function () {
                var self = this;
            	var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

            	var companyModel = new CompanyModel();
            	
            	var cname = $("#cname").val();
            	if ($.trim(cname) == "")
                {
            	    //cname = "My Company";
                }
               
            	var cemail = $("#cemail").val();
            	if ($.trim(cemail) == "") {
            	    cemail = "my@mail.com";
            	}
                
            	var phone = $("#phone").val();
            	if ($.trim(phone) == "") {
            	    phone = "";
            	}
                
            	var mobile = $("#mobile").val();
            	if ($.trim(mobile) == "") {
            	    mobile = "";
            	}
                
            	var fax = $("#fax").val();
            	if ($.trim(fax) == "") {
            	    fax = "";
            	}
               
            	companyModel.save({
                        cname: cname,
                        cemail: cemail,
                        cphones: {
                            phone: phone,
                            mobile: mobile
                        },
                        fax: fax
                    },
                    {
                        headers: {
                            uid: uid,
                            hash: hash,
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
                
            },

            render: function () {
                this.$el.html(this.template);
                return this;
            }

        });

        return CreateView;
    });