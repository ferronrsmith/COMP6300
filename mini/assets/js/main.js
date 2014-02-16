/**
 * User: ferron
 * Date: 2/19/13
 * Time: 3:51 AM
 * To change this template use File | Settings | File Templates.
 */

window.templateLoader = {

    // Map of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. A build script should concatenate
    // all the template files in a single file.
    load:function (names, callback) {

        var self = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('loading template: ' + name);
            $.get('tpl/' + name + '.hbs', function (data) {
                self.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            }, 'text');
        };

        loadTemplate(0);
    },

    // Get template by name from map of preloaded templates
    get:function (name) {
        return this.templates[name];
    }

};

(function () {
    var self = this;
    console.log('loading application');
        this.templateLoader.load(['main'], function () {
            self.app = new window.AppView;
        });
})();