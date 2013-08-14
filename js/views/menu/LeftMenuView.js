define([
    'jquery',
    'underscore',
    'backbone',
    'views/menu/MenuItem',
    'text!templates/menu/MenuTemplate.html',
    'collections/menu/MenuItems'
],
    function($, _, Backbone, MenuItemView, MenuTemplate, MenuItemsCollection){

        var LeftMenuView = Backbone.View.extend({
            tagName: 'nav',
            className: 'menu',
            el: '#leftmenu-holder nav',
            template: _.template(MenuTemplate),

            initialize: function(){
                console.log("init MenuView");
                //if(!options.collection) throw "No collection specified!";

                this.collection = new MenuItemsCollection();

                //_.bindAll(this,'render');
                this.collection.bind('reset', _.bind(this.render, this));
                var self = this;
                this.collection.bind('change:currentModule',this.render);

            },

            close: function(){
                this.unbind();
                this.collection.unbind();
            },

            render: function(event){
                console.log("Render MenuView");
                var $el = $(this.el);

                $el.html(MenuTemplate);

                var mname = this.collection.currentModule;

                var menuSection;
                var root = this.collection.root();
                for(var i= 0, len=root.length; i<len; i++){
                    if(root[i].get('mname') == mname){
                        menuSection = root[i];
                        break;
                    }
                }
                var elem =  $el.append(this.renderMenu([menuSection]));
                return this;
            },

            renderMenu: function(list){
                if(_.size(list) === 0) {return null;}
                var $dom = $('<ul></ul>');

                _.each(list, function(model){
                    var html =  this.renderMenuItem(model);
                    $dom.append(html);
                    var kids = this.collection.children(model);
                    $dom.find(':last').parent().append(this.renderMenu(kids));
                }, this);
                return $dom;
            },

            renderMenuItem: function(model){
                var view = new MenuItemView({model:model});
                var elem = view.render().el;
                return elem;
            }

        });

        return LeftMenuView;
    }
)






























