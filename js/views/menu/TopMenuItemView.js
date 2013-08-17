define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/menu/TopMenuItemTemplate.html'
],
    function($, _, Backbone, ItemTpl){

        var TopMenuItemView = Backbone.View.extend({
            tagName:'li',
            template: _.template(ItemTpl),

            initialize: function(options){

            },
            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }

        });

        return TopMenuItemView;
    }
)






























