define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Users/TopBarTemplate.html',
    'custom'
],
    function ($, _, Backbone, TopBarTemplate, Custom) {
        var UsersTopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Users",
            collectionLength: 0,
            template: _.template(TopBarTemplate),
            
            events:{
            	"click a.changeContentView": 'changeContentViewType',
            	"click ul.changeContentIndex a": 'changeItemIndex'
            },
            
            changeContentViewType: Custom.changeContentViewType,
            
            changeItemIndex: Custom.changeItemIndex,
            
            initialize: function(){
                this.render();
            },

            render: function(){
            	var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({viewType: viewType}));
                
                (viewType == "form") ? $("ul.changeContentIndex").show() && $("#top-bar-editBtn").show() 
                						  : $("ul.changeContentIndex").hide() && $("#top-bar-editBtn").hide();
               
                return this;
            }

        });



        return UsersTopBarView;
    });