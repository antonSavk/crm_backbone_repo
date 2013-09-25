define([
    "text!templates/Companies/list/ListItemTemplate.html"
],
    function (ListItemTemplate) {
        var ListItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            events: {
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).closest("tr").data("index") + 1;
                window.location.hash = "#home/content-Companies/form/" + itemIndex;
            },
            
            template: _.template(ListItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return ListItemView;
    });