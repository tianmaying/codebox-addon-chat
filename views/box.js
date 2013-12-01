define([
    "views/messages",
    "less!stylesheets/box.less"
], function(MessagesList) {
    var hr = codebox.require("hr/hr");
    var api = codebox.require("core/api");

    var ChatBoxView = hr.View.extend({
        className: "chat-box",
        templateLoader: "addon.chat.templates",
        template: "box.html",
        events: {
            "click .box-body": "focus",
            "click .box-header": "toggle",
            "click .box-close": "close",
            "keyup .box-input": "messageInput"
        },

        // Constructor
        initialize: function() {
            ChatBoxView.__super__.initialize.apply(this, arguments);

            this.list = new MessagesList();
            this.list.on("change:add", function() {
                if (this.animation != null) {
                    this.animation.stop();
                }

                this.animation = this.$(".box-messages").animate({
                    scrollTop: this.$(".box-messages")[0].scrollHeight
                }, 60);
            }, this);
        },

        // Finish rendering
        finish: function() {
            this.list.$el.appendTo(this.$(".box-messages"));
            return ChatBoxView.__super__.finish.apply(this, arguments);
        },

        // Templates Context
        templateContext: function() {
            return {
                'title': this.options.title
            }
        },

        // Toggle box
        toggle: function(st) {
            this.$el.toggleClass("mode-open", st);
            st = this.$el.hasClass("mode-open");

            if (st) {
                this.focus();
            } else {
                this.blur();
            }

            return this;
        },

        // Focus the message input
        focus: function() {
            this.$(".box-input").focus();
        },

        // Blur the message input
        blur: function() {
            this.$(".box-input").blur();
        },

        // Close box
        close: function() {
            this.remove();
            this.trigger("close");
        },

        // Key input on message
        messageInput: function(e) {
            var key = e.keyCode || e.which;
            var $input = $(e.currentTarget);
            var val = $input.val();

            if (key === 13 && val.length > 0) {
                api.rpc("/chat/send", {
                    "message": val,
                    "to": this.options.to
                }).then(function() {
                    $input.val("");
                });
            }
        }
    });

    return ChatBoxView;
});