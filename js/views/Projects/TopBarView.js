define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Projects/TopBarTemplate.html',
    'custom'
],
    function ($, _, Backbone, TopBarTemplate, Custom) {
        var ProjectsTopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Projects",
            template: _.template(TopBarTemplate),
            
            events:{
            	"click a.changeContentView": 'changeContentViewType',
            	"click ul.changeContentIndex a": 'changeItemIndex',
            	"click #top-bar-deleteBtn": "deleteEvent"
            },
            
            changeContentViewType: Custom.changeContentViewType,
            
            changeItemIndex: Custom.changeItemIndex,
            
            initialize: function(){
                this.render();
            },

            render: function(){
            	var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({viewType: viewType}));
                
                (viewType == "form") ? $("ul.changeContentIndex").show() && $("#top-bar-editBtn").show() && $("#top-bar-deleteBtn").show() 
                						  : $("ul.changeContentIndex").hide() && $("#top-bar-editBtn").hide() && $("#top-bar-deleteBtn").hide();
                
                return this;
            },
            
            deleteEvent: function(event)
            {
            	event.preventDefault();
            	var answer=confirm("Realy DELETE items ?!");
            	if (answer==true) this.trigger('deleteEvent');
            }
            
        });



        return ProjectsTopBarView;
    });