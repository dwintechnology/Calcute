const utils = require('../../lib/utils/common.js'),
      pathUtil = require('../../lib/utils/schema-path.js');
module.exports = function ngForm($compile, $window, models){
    class Field {
        constructor(){
            this.display = '';
            this.listeners = {
                change: [],
                activate: [],
                deactivate: []
            };
            this.visible = true;
            this.active = false;
        }
        initCtrl(ctrl, form, name){
            var self = this;
            this.ctrl = ctrl;
            ctrl.$name = name;
            ctrl.path = form.getPath(name);
            ctrl.setOther = angular.bind(ctrl, function setOther(set){
                form.setOther(this.$name, true);
            });
            ctrl.activate = angular.bind(ctrl, function(clear){
                if(clear){
                    this.$setViewValue();
                    form.setValue(this.$name);
                }
                ctrl.$setUntouched();
                form.trigger(this.$name, 'activate');
            });
            ctrl.deactivate = angular.bind(ctrl, function(){
                this.$setTouched();
                form.trigger(this.$name, 'deactivate');
                form.setOther(this.$name, false);
            });
            var isEmpty = ctrl.$isEmpty;
            ctrl.$isEmpty = function(value){
                return (value!==null)&&isEmpty(value);
            }
            if(ctrl.path.options.ref) {
                ctrl.ref = models[ctrl.path.options.ref];
                ctrl.initRef = angular.bind(ctrl, function(opts) {
                    this.value = new this.ref(opts);
                });
                ctrl.setRef = function (value) {
                    if(angular.isObject(value)) {
                        value.$submitted = true;
                    }
                    this.$setViewValue(value);
                }
            }
            else if(pathUtil.isMultiRef(ctrl.path)){
                ctrl.ref = models[ctrl.path.options.type[0].ref];
                ctrl.setCount = angular.bind(ctrl, function fieldSetCount(count) {
                    var value = this.$viewValue || [],
                    count = parseInt(count);
                    if(this.$viewValue&&count==value.length){
                        return;
                    }
                    value = value.slice(0, count);
                    for(var i=0; i < count; i++) {
                        if(value.length <= i) {
                            value.push(new this.ref());
                        }
                    }
                    this.$setViewValue(value.slice(0, count));
                    this.$validate();
                });
                ctrl.$isEmpty = function(value){
                    return (!angular.isArray(value))||isEmpty(value);
                }
            }
            else if(angular.isArray(ctrl.path.options.type)){
                ctrl.addOrRemove = angular.bind(ctrl, function(value){
                    var values = this.$viewValue||[],
                        index = values.indexOf(value);
                    if(index>-1){
                        values.splice(index, 1);
                    }
                    else {
                        values.push(value);
                    }
                    var newValues = [];
                    angular.forEach(values, function(v){
                        newValues.push(v);
                    });
                    this.$setViewValue(newValues);
                });
            }
            angular.forEach(ctrl.path.validators, function(opts) {
                this.$validators[opts.type] = angular.bind(opts, function(modelValue, viewValue) {
                    var value = viewValue || modelValue,
                        valid = this.validator.call(form.getInstance(), value);
                    return Boolean(valid);
                });
            }, ctrl);
            ctrl.$validate();
        }
        on(eName, fn){
            utils.assert(eName in this.listeners);
            this.listeners[eName].push(fn);
        }
        off(eName, fn){
            utils.assert(eName in this.listeners);
            var index = this.listeners[eName].indexOf(fn);
            if(index>=0){
                this.listeners[eName].splice(index, 1);
            }
        }
        trigger(eName, args){
            utils.assert(eName in this.listeners);
            angular.forEach(this.listeners[eName], function(fn){
                fn.apply(fn, args);
            }, this);
        }
    }
    return {
        restrict: 'AE',
        require: ['form', '?^ngModel'],
        link: {pre: function(scope, element, attrs, ctrls){
            var modelName = attrs.model,
                ngForm = ctrls[0],
                pNgModel = ctrls[1],
                model = modelName ? models[modelName] : null,
                iName = attrs.instance||'formInstance',
                initial = scope.$eval(attrs.initial)||{},
                iScope = scope;
            if(model){
                ngForm.modelName = modelName;
                ngForm.fields = {};
                if(pNgModel){
                    ngForm.pNgModel = pNgModel;
                }
                angular.forEach(iName.split('.'), function(name, i, array){
                    if(i==(array.length-1)){
                        if(!iScope[name]||!(iScope[name] instanceof model)){
                            iScope[name] = new model(angular.isObject(iScope[name]) ? iScope[name] : undefined);
                        }
                        iName = name;
                    }
                    else {
                        if(!angular.isObject(iScope[name])){
                            iScope[name] = {};
                        }
                        iScope = iScope[name];
                    }
                });
                ngForm.getInstance = angular.bind(ngForm, function(){
                    return iScope[iName];
                });
                ngForm.registerField = angular.bind(ngForm, function(path, controller){
                    utils.assert(path in model.prototype.schema.paths);
                    this.fields[path] = new Field();
                    this.fields[path].initCtrl(controller, ngForm, path);
                    return controller;
                });
                ngForm.getPath = function(path){
                    utils.assert(path in model.prototype.schema.paths, `path '${path}' not found in model ${modelName}`);
                    return model.prototype.schema.paths[path];
                }
                ngForm.getValue = angular.bind(ngForm, function(path){
                    utils.assert(path in model.prototype.schema.paths);
                    return this.getInstance()[path];
                });
                ngForm.setValue = angular.bind(ngForm, function(path, value){
                    utils.assert(path in model.prototype.schema.paths);
                    this.getInstance()[path] = value;
                    this.updateDisplay(path);
                    this.trigger(path, 'change', [value]);
                    for(var path in this.fields){
                        var visible = ngForm.isVisible(path);
                        if(visible!=this.fields[path].visible){
                            this.fields[path].visible = visible;
                        }
                    }
                });
                ngForm.setOther = angular.bind(ngForm, function(path, value){
                    utils.assert(path in model.prototype.schema.paths);
                    this[path + 'Other'] = value;
                });
                ngForm.updateDisplay = angular.bind(ngForm, function(path){
                    utils.assert(path in this.fields);
                    var instance = this.getInstance();
                    if(instance&&angular.isFunction(instance.display)){
                        this.fields[path].display = instance.display(path, instance[path])||'';
                    }
                });
                ngForm.clearDisplay = angular.bind(ngForm, function(path){
                    utils.assert(path in this.fields);
                    this.fields[path].display = '';
                });
                ngForm.isVisible = angular.bind(ngForm, function(path){
                    utils.assert(path in this.fields);
                    var instance = this.getInstance();
                    if(instance&&angular.isFunction(instance.isVisible)){
                        return instance.isVisible(path);
                    }
                    return true; 
                });
                ngForm.on = angular.bind(ngForm, function(path, eName, fn, scope){
                    var self = this;
                    utils.assert(path in this.fields);
                    self.fields[path].on(eName, fn);
                    scope.$on('$destroy', function(){
                        self.fields[path].off(eName, fn);
                    });
                });
                ngForm.trigger = angular.bind(ngForm, function(path, eName, args){
                    utils.assert(path in this.fields);
                    this.fields[path].trigger(eName, args);
                });
                ngForm.save = angular.bind(ngForm, function(){
                    this.getInstance().$save().then(function(){
                        $window.scrollTo(0, 0);
                        ngForm.$commited = true;
                    });
                });
                ngForm.updateParent = angular.bind(ngForm, function(){
                    if(this.pNgModel){
                        this.pNgModel.$validate();
                    }
                });
                angular.forEach(model.prototype.schema.paths, function(path, name){
                    if(path.options.default&&!(name in initial)){
                        initial[name] = path.options.default;
                    }
                });
                angular.forEach(initial, function(val, name){
                    var path = this.getPath(name);
                    if(pathUtil.isMultiRef(path)){
                        var refs = [],
                            model = models[path.options.type[0].ref];
                        angular.forEach(val, function(id){
                            refs.push(new model({_id: id}));
                        });
                        iScope[iName][name] = refs;
                    }
                    else {
                        iScope[iName][name] = val;
                    }
                }, ngForm);
                ngForm.$ready = true;
            }
        }}
    };
};
