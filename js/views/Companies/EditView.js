define([
    "text!templates/Companies/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, CompaniesCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",

            initialize: function (options) {
               this.companiesCollection = options.collection;
               
               this.render();
            },

            saveItem: function(){
            	var itemIndex = Custom.getCurrentII() - 1;
            	
            	if (itemIndex != -1) 
        		{
            		var currentModel = this.collection.models[itemIndex];
            		
            		var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            	
            		var cname = $("#cname").val();
            		if ($.trim(cname) == "") {
            		    cname = "My Company";
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
            	    
            	    currentModel.set({
            	        cname: cname,
            	        cemail: cemail,
            	        cphones: {
            	            phone: phone,
            	            mobile: mobile
            	        },
            	        fax: fax
            	    });
	                
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
        		{
        			this.$el.html();
        		}else
        		{
        			var currentModel = this.companiesCollection.models[itemIndex];
        			this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON() }));
        		}
            	
                return this;
            }

        });

        return EditView;
    });