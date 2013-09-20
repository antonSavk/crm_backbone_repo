define([
        'text!templates/main/MainTemplate.html',
        'views/menu/LeftMenuView',
        'collections/menu/MenuItems',
        'views/menu/TopMenuView'
    ], function(MainTemplate, LeftMenuView, MenuItemsCollection, TopMenuView) {

        var MainView = Backbone.View.extend({
            el: '#wrapper',

            initialize: function() {
                this.render();
                this.collection = new MenuItemsCollection();
                this.collection.bind('reset', this.createMenuViews, this);
            },

            createMenuViews: function() {
                this.leftMenu = new LeftMenuView({ collection: this.collection });
                var root = this.collection.getRootElements();
                this.topMenu = new TopMenuView({ collection: this.collection.getRootElements() });
                this.topMenu.bind('changeSelection', this.leftMenu.setCurrentSection, { leftMenu: this.leftMenu });
            },

            render: function() {
                console.log('Render Main View');
                this.$el.html(MainTemplate);
                return this;
            }
        });

        return MainView;

    });
