(function($){

    angular.module('cockpit.services').factory('Contentfields', function Contentfields() {

        var fields = {

            'text': {
                label: 'Text',
                template: function(model) {
                    return '<input class="uk-width-1-1 uk-form-large" type="text"  ng-model="'+model+'">';
                }
            },

            'select': {
                label: 'Select',
                template: function(model, settings) {

                    var options = settings.options || [],
                        output  = ['<select class="uk-width-1-1 uk-form-large" data-ng-model="'+model+'">'];

                    for (var i=0;i < options.length;i++) {
                        output.push('<option value="'+options[i]+'">'+options[i]+'</option>');
                    }

                    output.push('</select>');

                    return output.join("\n");
                }
            },

            'boolean': {
                label: 'Boolean',
                template: function(model) {
                    return '<input type="checkbox" ng-model="'+model+'">';
                }
            },

            'html': {
                label: 'Html',
                template: function(model) {
                    return '<htmleditor ng-model="'+model+'"></htmleditor>';
                }
            },

            'markdown': {
                label: 'Markdown',
                template: function(model) {
                    return '<htmleditor ng-model="'+model+'" options="{markdown:true}"></htmleditor>';
                }
            },

            'wysiwyg': {
                label: 'Html (WYSIWYG)',
                template: function(model) {
                    return '<textarea wysiwyg class="uk-width-1-1 uk-form-large" ng-model="'+model+'" style="visibility:hidden;"></textarea>';
                }
            },

            'code': {
                label: 'code',
                template: function(model, options) {
                    return '<textarea codearea="{mode:\''+(options.syntax || 'text')+'\'}" class="uk-width-1-1" ng-model="'+model+'" style="height:350px !important;"></textarea>';
                }
            },

            'date': {
                label: 'Date',
                template: function(model) {
                    return '<div class="uk-form-icon uk-width-1-1"> \
                                <i class="uk-icon-calendar"></i> \
                                <input class="uk-width-1-1 uk-form-large" type="text" data-uk-datepicker="{format:\'YYYY-MM-DD\'}" ng-model="'+model+'"> \
                            </div>';
                }
            },

            'time': {
                label: 'Time',
                template: function(model) {
                    return '<div class="uk-form-icon uk-width-1-1" data-uk-timepicker> \
                                <i class="uk-icon-clock-o"></i> \
                                <input class="uk-width-1-1 uk-form-large" type="text" ng-model="'+model+'"> \
                            </div>';
                }
            },

            'media': {
                label: 'Media',
                template: function(model, options) {
                    return '<input type="text" media-path-picker="'+(options.allowed || '*')+'" ng-model="'+model+'">';
                }
            },

            'region': {
                label: 'Region',
                template: function(model) {
                    return '<input class="uk-width-1-1 uk-form-large" type="text" region-picker ng-model="'+model+'">';
                }
            },

            'link-collection': {
                label: 'Collection link',
                template: function(model, options) {
                    return '<div link-collection="'+options.collection+'" ng-model="'+model+'" data-multiple="'+(options.multiple ? 'true':'false')+'">Linking '+options.collection+'</div>';
                }
            },

            'gallery': {
                label: 'Gallery',
                template: function(model) {
                    return '<gallery ng-model="'+model+'"></gallery>';
                }
            },

            'tags': {
                label: 'Tags',
                template: function(model) {
                    return '<tags ng-model="'+model+'"></tags>';
                }
            }
        };

        return {

            register: function(field, settings) {
                fields[field] = angular.extend({
                    label: field,
                    assets:[],
                    template: function() {

                    }
                }, settings);
            },

            exists: function(field) {
                return fields[field] ? true : false;
            },

            get: function(field) {
                return fields[field];
            },

            fields: function() {
                var ret = [];

                Object.keys(fields).forEach(function(f) {
                    ret.push({name: f, label: fields[f].label});
                });

                return ret;
            }
        };
    });

    angular.module('cockpit.directives').directive("contentfield", function($timeout, $compile, Contentfields) {

        return {

            require: '?ngModel',
            restrict: 'E',

            link: function(scope, elm, attrs, ngModel) {

                var defer = function() {

                    var options = $.extend({type: 'text'}, JSON.parse(attrs.options || '{}'));

                    if (Contentfields.exists(options.type)) {

                        var field = Contentfields.get(options.type), content;

                        content = field.template(attrs.ngModel, options);

                        if (content['then']) {

                            content.then(function(markup){
                                $compile(elm.html(markup).contents())(scope);
                            });

                        } else {
                            $compile(elm.html(content).contents())(scope);
                        }

                    } else {
                        $compile(elm.html(Contentfields.get('text').template(attrs.ngModel)).contents())(scope);
                    }
                };

                $timeout(defer);
            }
        };

    });

})(jQuery);