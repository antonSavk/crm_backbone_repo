define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Customers/CustomersTopBarTemplate.html',
    'custom'
],
    function ($, _, Backbone, CustomersTopBarTemplate, Custom) {
        var CustomersTopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Customers",
            viewtype: null,
            currentItem: 5,
            template: _.template(CustomersTopBarTemplate),
            
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



        return CustomersTopBarView;
    });