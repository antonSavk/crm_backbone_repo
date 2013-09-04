define([
    'jquery',
    'underscore',
    'backbone',
    'views/menu/MenuItem',
    'collections/menu/MenuItems'
],
    function($, _, Backbone, MenuItemView){

        var LeftMenuView = Backbone.View.extend({
            tagName: 'nav',
            className: 'menu',
            el: '#leftmenu-holder nav',
            currentSection:null,

            setCurrentSection:function(section){
                this.leftMenu.currentSection = section;
                this.leftMenu.render();
            },

            initialize: function(options){
                console.log("init MenuView");
                if(!options.collection) throw "No collection specified!";
                this.collection = options.collection;
                _.bindAll(this, 'render');
                this.render();
                this.collection.bind('reset', _.bind(this.render, this));

            },

            render: function(){
                console.log("Render LeftMenuView");
                var $el = $(this.el);
                $el.html('');
                var currentModule = null;
                var root = this.collection.root();
                if(this.currentSection == null)
                    this.currentSection = root[0].get('mname');

                for(var i= 0, len=root.length; i<len; i++){
                    if(root[i].get('mname') == this.currentSection){
                        currentModule = root[i];
                        break;
                    }
                }
                if (currentModule == null) currentModule = root[0];


                var elem = $el.append(this.renderMenu(this.collection.children(currentModule)));
                return this;
            },

            renderMenu: function(list){
                if(_.size(list) === 0) {return null;}
                var $dom = $('<ul></ul>');

                _.each(list, function(model){
                    var html =  this.renderMenuItem(model);
                    
                    $dom.append(html);
                    var kids = this.collection.children(model);
                    $dom.find(':last').append(this.renderMenu(kids));
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






























