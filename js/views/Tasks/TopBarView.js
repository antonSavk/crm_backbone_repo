define([
    'text!templates/Tasks/TopBarTemplate.html',
    'custom'
],
    function (ContentTopBarTemplate, Custom) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: "Tasks",
            actionType: null,
            collectionLength: 0,
            template: _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView": 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-saveBtn": "saveEvent",
                "click #top-bar-discardBtn": "discardEvent"
            },

            changeContentViewType: function (e) {
                var windowLocHash = window.location.hash.split('/')[3];
                var hash;
                if (typeof windowLocHash != "undefined" && windowLocHash.length == 24) {
                    hash = windowLocHash;
                }
                Custom.changeContentViewType(e, hash, this.contentType);
            },

            changeItemIndex: function (e) {
                var windowLocHash = window.location.hash.split('/')[3];
                var actionType = "Content";
                var hash;
                if (typeof windowLocHash != "undefined" && windowLocHash.length == 24) {
                    hash = windowLocHash;
                }
                Custom.changeItemIndex(e, hash, actionType, this.contentType);
            },

            initialize: function (options) {
                this.actionType = options.actionType;
                if (this.actionType !== "Content")
                    Custom.setCurrentVT("form");
                this.render();
            },

            render: function () {

                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType }));

                if (this.actionType == "Content") {
                    $("#createBtnHolder").show();
                    $("#saveDiscardHolder").hide();
                } else {
                    $("#createBtnHolder").hide();
                    $("#saveDiscardHolder").show();
                }

                if ((viewType == "form") && (this.actionType === "Content")) {
                    $("ul.changeContentIndex").show();
                    $("#top-bar-editBtn").show();
                    $("#top-bar-deleteBtn").show();
                } else
                    if ((viewType == "form") && (this.actionType === "Edit")) {
                        $("ul.changeContentIndex").show();
                    }

                return this;
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) this.trigger('deleteEvent');
            },

            saveEvent: function (event) {
                event.preventDefault();
                this.trigger('saveEvent');
            },

            discardEvent: function (event) {
                event.preventDefault();
                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
            }

        });

        return TopBarView;
    });