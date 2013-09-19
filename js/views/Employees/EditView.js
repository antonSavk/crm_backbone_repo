define([
    "text!templates/Employees/EditTemplate.html",
    "collections/Employees/EmployeesCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, EmployeesCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",

            initialize: function (options) {
               //this.workflowsDdCollection = new WorkflowsCollection({id:'project'});
               this.employeesCollection = options.collection;
               
               this.employeesCollection.bind('reset', _.bind(this.render, this));
               //this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
               
               this.render();
            },

            events: {
                "click #tabList a": "switchTab"
            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem: function(){
            	var itemIndex = Custom.getCurrentII() - 1;
            	
            	if (itemIndex != -1) 
        		{
            		var currentModel = this.collection.models[itemIndex];
            		
            		var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            	     
            		var name = $("#name").val();
            		if ($.trim(name) == "") {
            		    name = "New Employee";
            		}

            		var wemail = $("#wemail").val();
            		if ($.trim(wemail) == "") {
            		    wemail = null;
            		}

            		var phone = $("#phone").val();
            		var mobile = $("#mobile").val();
            		var wphones = {};
            		if ($.trim(phone) == "" || $.trim(mobile) == "") {
            		    wphones = null;
            		}
            		else {
            		    wphones.phone = phone;
            		    wphones.mobile = mobile;
            		}

            		var officeLocation = $("#officeLocation").val();
            		if ($.trim(officeLocation) == "") {
            		    officeLocation = null;
            		}

            		var identNo = parseInt($.trim($("#identNo").val()));
            		if (!identNo) {
            		    identNo = null;
            		}

            		var passportNo = parseInt($.trim($("#passportNo").val()));
            		if (!passportNo) {
            		    passportNo = null;
            		}

            		var otherId = parseInt($.trim($("#otherId").val()));
            		if (!otherId) {
            		    otherId = null;
            		}

            		var dateBirthSt = $.trim($("#dateBirth").val());
            		var dateBirth = "";
            		if (!dateBirthSt) {
            		    dateBirth = null;
            		}
            		else {
            		    dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
            		}

            		var active = false;
            		if ($("#active:checked")) active = true;
	                
	                currentModel.set({
	                    name: name,
	                    wemail: wemail,
	                    wphones: wphones,
	                    officeLocation: officeLocation,
	                    relatedUser: null,
	                    visibility: null,
	                    department: null,
	                    job: null,
	                    manager: null,
	                    coach: null,
	                    nationality: null,
	                    identNo: identNo,
	                    passportNo: passportNo,
	                    bankAccountNo: null,
	                    otherId: otherId,
	                    gender: null,
	                    maritalStatus: null,
	                    homeAddress: null,
	                    dateBirth: dateBirth,
	                    active: active
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
            	    var currentModel = this.employeesCollection.models[itemIndex];
            	    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON() }));
        		}
            	
                return this;
            }

        });

        return EditView;
    });