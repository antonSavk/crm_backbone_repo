define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Projects/ProjectsTopBarTemplate.html',
    'custom'
],
    function ($, _, Backbone, ProjectsTopBarTemplate, Custom) {
        var ProjectsTopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Projects",
            viewtype: null,
            currentItem: 5,
            collectionLength: 0,
            template: _.template(ProjectsTopBarTemplate),
            
            events:{
            	"click a.changeContentView": 'changeContentViewType',
            	"click a.changeContentIndex": 'changeContentIndex'
            },
            
            changeContentViewType: Custom.changeContentViewType,
            
            changeContentIndex: Custom.changeContentIndex,
            
            initialize: function(options){
            	this.currentItem = options.currentItem;
            	this.viewtype = options.viewtype;
                this.render();
            },

            render: function(){
                this.$el.html(this.template({viewtype:this.options.viewtype}));
                return this;
            }

        });



        return ProjectsTopBarView;
    });