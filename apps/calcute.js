'use strict';
const directives = {
    screens: require('./directives/screens.js'),
    screen: require('./directives/screen.js'),
    ngImg: require('./directives/ng-img.js'),
    ngForm: require('./directives/ng-form.js'),
    ngModel: require('./directives/ng-model.js'),
    ngModelSet: require('./directives/ng-model-set.js'),
    input: require('./directives/input.js'),
    textarea: require('./directives/textarea.js'),
    query: require('./directives/query.js')
};
const modules = [
    require('./modules/models.js')
];
const controllers = {
    KK: require('./controllers/kk.js'),
    KKInspection: require('./controllers/kk-inspection.js'),
    KKCompensation: require('./controllers/kk-compensation.js'),
    MSKP: require('./controllers/mskp.js'),
};
const services = {
    utils: require('./services/utils.js')
};
const externals = [
    'ngMessages',
    'ngResource',
    'ngAnimate'
];

let app = angular.module('Calcute', externals).config(function($httpProvider){
    $httpProvider.interceptors.push(function($q){
        return {request: function(config){
            if(config.url&&config.url.length&&config.url[0]=='/'){
                config.url = settings.serviceUrl + config.url;
            }
            return config;
        }};
    });
});

angular.forEach(directives, function(directive, name){
    this.directive(name, directive);
}, app);

angular.forEach(modules, function(module){
    module(this);
}, app);

angular.forEach(services, function(service, name){
    this.service(name, service);
}, app);

angular.forEach(controllers, function(controller, name){
    this.controller(`${name}Controller`, controller);
}, app);

if(settings.debug){
    angular.forEach({
        TestPhone: require('./controllers/test/phone'),
        TestEmail: require('./controllers/test/email')
    }, function(controller, name){
        this.controller(`${name}Controller`, controller);
    }, app);
}
