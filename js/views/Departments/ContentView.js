define([
    'text!templates/Departments/list/ListTemplate.html',
    'text!templates/Departments/form/FormTemplate.html',
    'collections/Departments/DepartmentsCollection',
    'views/Departments/list/ListItemView',
    'custom',
    'localstorage'

],
function (ListTemplate, FormTemplate, DepartmentsCollection, ListItemView, Custom, LocalStorage) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Departments View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked"
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Departments View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate));
                        var table = this.$el.find('table > tbody');

                        this.collection.each(function (model) {
                            table.append(new ListItemView({ model: model }).render().el);
                        });

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.models.length - 1) {
                            itemIndex = this.collection.models.length - 1;
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }
            }

            return this;

        },

        checked: function (event) {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var self = this,
        		hash = LocalStorage.getFromLocalStorage('hash'),
        		uid = LocalStorage.getFromLocalStorage('uid'),
        		mid = 39;

            $.each($("tbody input:checked"), function (index, checkbox) {
                var project = self.collection.get(checkbox.value);

                /*project.set("projectname", 'testEDIT');
        		
        		project.save({},{
        			headers: {
        				uid: uid,
        				hash: hash,
        				mid: mid
        			}
        		});*/

                project.destroy({
                    headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                },
                    { wait: true }
                );
            });

            this.collection.trigger('reset');
        }
    });

    return ContentView;
});
