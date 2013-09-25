define([
        "text!templates/Applications/kanban/KanbanItemTemplate.html",
        "collections/Applications/ApplicationsCollection",
        'localstorage',
        'custom'
    ],
    function (KanbanItemTemplate, ApplicationsCollection, LocalStorage, Custom) {
        var ApplicationsItemView = Backbone.View.extend({
            className: "application",
            id: function() {
                return this.model.get("_id");
            },

            initialize: function () {
                this.model.on('change', this.render, this);
                this.collection = new ApplicationsCollection();
                this.collection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click #delete": "deleteItem",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor",
                "click .application-content": "gotoForm",
                "click #edit": "gotoEditForm"
            },

            template: _.template(KanbanItemTemplate),

            gotoEditForm: function(e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest(".application").data("index") + 1;
                window.location.hash = "#home/action-Applications/Edit/" + itemIndex;
            },

            gotoForm: function(e) {
                var itemIndex = $(e.target).closest(".application").data("index") + 1;
                App.ownContentType = true;
                window.location.hash = "home/content-Applications/form/" + itemIndex;
            },

            deleteItem: function(e) {
                e.preventDefault();
                hash = LocalStorage.getFromLocalStorage('hash'),
                uid = LocalStorage.getFromLocalStorage('uid'),
                mid = 39;
                var that = this;
                var model = that.collection.get($(e.target).closest(".application").attr("id"));
                //var remaining = model.get("estimated") - model.get("loged");
                this.$("#delete").closest(".application").fadeToggle(300, function () {
                    model.destroy(
                        {
                            headers: {
                                uid: uid,
                                hash: hash,
                                mid: mid
                            }
                        },
                        { wait: true });
                    $(this).remove();
                });
                var column = this.$el.closest(".column");
                column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                //column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - remaining);
                this.collection.trigger('reset');
            },

            openDropDown: function(e) {
                e.preventDefault();
                this.$(".dropDown > a").toggleClass("selected").siblings(".dropDownOpened").fadeToggle("normal");
            },

            pickColor: function(e) {
                e.preventDefault();
                var hash = LocalStorage.getFromLocalStorage('hash'),
                    uid = LocalStorage.getFromLocalStorage('uid'),
                    mid = 39;
                var color = $(e.target).data("color");
                this.changeColor(color);
                this.model.set({ color: color });
                this.model.save({ color: color }, {
                    headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                });
            },

            changeColor: function(color) {
                this.$(".colorPicker a").closest(".application-header").css('background-color', color).closest(".application").css('border-color', color);
            },

            //isLater: function(str1, str2) {
            //    return new Date(str1) > new Date(str2);
            //},

            //changeDeadlineColor: function() {
            //    if ((this.$el.attr("id") == this.model.get('id'))) {
            //        this.$(".deadline").css({ 'color': '#E74C3C' });
            //    }
            //},

            render: function() {
                var index = this.model.collection.indexOf(this.model);
                var todayString = new Date().format("yyyy-mm-dd");
                //if (this.model.get('deadline')) {
                //    var deadlineString = this.model.get('deadline').split('T')[0];
                //    this.model.set({ deadline: deadlineString.replace(/-/g, '/') }, { silent: true });
                //}
                this.$el.html(this.template(this.model.toJSON()));
                //if (this.isLater(todayString, deadlineString)) {
                //    this.changeDeadlineColor();
                //}
                this.changeColor(this.model.get('color'));
                this.$el.attr("data-index", index);
                return this;
            }
        });

        return ApplicationsItemView;
    });