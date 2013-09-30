define([
    'text!templates/Projects/list/ListTemplate.html',
    'text!templates/Projects/form/FormTemplate.html',
    'views/Projects/list/ListItemView',
    'views/Projects/thumbnails/ThumbnailsItemView',
    'custom',
    'localstorage',
    "GanttChart"
],
function (ListTemplate, FormTemplate, ListItemView, ThumbnailsItemView, Custom, LocalStorage,GanttChart) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked"
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html('');
                        this.$el.html(_.template(ListTemplate));
                        if(this.collection.length > 0){
                            var table = this.$el.find('table > tbody');
                            this.collection.each(function (model) {
                                table.append(new ListItemView({ model: model }).render().el);
                            });
                        }

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html('');
                        if(this.collection.length > 0){
                            var holder = this.$el;
                            this.collection.each(function (model) {
                                $(holder).append(new ThumbnailsItemView({ model: model }).render().el);
                            });
                        } else{
                            this.$el.html('<h2>No projects found</h2>');
                        }
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
                            this.$el.html('<h2>No projects found</h2>');
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }
                case "gantt":
                    {
                        this.$el.html('');
                        console.log('render gantt');
                        this.$el.html('<div style=" height:570px; position:relative;" id="GanttDiv"></div>');
                        GanttChart.create("GanttDiv");
                        GanttChart.parseProjects(this.collection);
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
