(function ($, tpl) {

    var User = Backbone.Model.extend({
        default : function () {
            return {
                id : Users.nextOrder(),
                name : '',
                email : 'noreply@noemail.com',
                fact : '',
                hobbies : []

            }
        },
        initialize : function () {
        }
    });

    var UserList = Backbone.Collection.extend({
        model : User,
        url : 'http://localhost/sample_app_1/users/usersls',
        nextOrder : function () {
            if(!this.length) return 1;
            return this.last().get('order') + 1;
        },
        comparator : function (user) {
          return user.get('order');
        }

    });

    var Users = new UserList;

    var UserView = Backbone.View.extend({
        tagName : 'tr',
        initialize : function () {
            this.template = Handlebars.compile(tpl.get('main'));
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },
        render : function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });

    // global application entry point
    window.AppView = Backbone.View.extend({
        el : $('#appView'),
        initialize : function () {
            Users.on('add', this.addOne, this);
            Users.on('reset', this.addAll, this);
            Users.fetch();
        },
        addOne : function (user) {
            var view = new UserView({model:user});
            this.$('#userList').append(view.render().el);
        },
        addAll : function () {
            Users.each(this.addOne);
        }
    });

}(jQuery, window.templateLoader));