define([
    'text!templates/Degrees/TopBarTemplate.html',
    'collections/Degrees/DegreesCollection',
    'custom'
],
    function (ContentTopBarTemplate, DegreesCollection, Custom) {
        var TopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Degrees",
            actionType: null, //Content, Edit, Create
            template: _.template(ContentTopBarTemplate),
            
            events:{
            	"click a.changeContentView": 'changeContentViewType',
            	"click ul.changeContentIndex a": 'changeItemIndex',
            	"click #top-bar-deleteBtn": "deleteEvent",
            	"click #top-bar-saveBtn": "saveEvent",
            	"click #top-bar-discardBtn": "discardEvent"
            },
            
            changeContentViewType: Custom.changeContentViewType,
            
            changeItemIndex: Custom.changeItemIndex,
            
            initialize: function(options){
            	this.actionType = options.actionType;
            	if (this.actionType !== "Content")
            		Custom.setCurrentVT("form");
            	this.collection = new DegreesCollection();
            	this.collection.bind('reset', _.bind(this.render, this));
                //this.render();
            },

            render: function(){
                var viewType = Custom.getCurrentVT();
                var collectionLength = this.collection.length;
                var itemIndex = Custom.getCurrentII();
            	
                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType, collectionLength: collectionLength, itemIndex: itemIndex }));
                
                if (this.actionType == "Content")
                {
                	$("#createBtnHolder").show();
                	$("#saveDiscardHolder").hide();
                }else
                {
                	$("#createBtnHolder").hide();
                	$("#saveDiscardHolder").show();
                }
                
                $("ul.changeContentIndex").hide();
            	$("#top-bar-editBtn").hide();
            	$("#top-bar-deleteBtn").hide();
                
                if ((viewType == "form") && (this.actionType === "Content"))
                {
                	$("ul.changeContentIndex").show();
                	$("#top-bar-editBtn").show();
                	$("#top-bar-deleteBtn").show();
                	$("#template-switcher>span").show();
                }else
                if ((viewType == "form") && (this.actionType === "Edit"))
                {
                    $("ul.changeContentIndex").show();
                    $("#template-switcher>span").show();
                }
                
                return this;
            },
            
            deleteEvent: function(event)
            {
            	event.preventDefault();
            	var answer=confirm("Realy DELETE items ?!");
            	if (answer==true) this.trigger('deleteEvent');
            },
            
            saveEvent: function(event)
            {
            	event.preventDefault();
            	this.trigger('saveEvent');
            },
            
            discardEvent: function(event)
            {
            	event.preventDefault();
            	Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
            }
        });

        return TopBarView;
    });