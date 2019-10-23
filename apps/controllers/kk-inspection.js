'use strict';
module.exports = function KKInspectionController($scope, InspectionInfo, Module, utils, $window, $location, $sce){
    function isEmpty(value){
        return value===null || value===undefined || value==='';
    }
    Module.get({domains: $location.hostname}).$promise.then(module => {
        $scope.yamoneyIframe = $sce.trustAsHtml(`<iframe style="transform: scale(1.45) translateY(30px)" frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/quickpay/shop-widget?account=410012467326030&quickpay=shop&payment-type-choice=on&mobile-payment-type-choice=on&writer=seller&targets=%D0%94%D0%B8%D0%B0%D0%B3%D0%BD%D0%BE%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F+%D0%BA%D0%B0%D1%80%D1%82%D0%B0&default-sum=${module.diagCardPrice}&button-text=02&fio=on&mail=on&phone=on&successURL=" width="450" height="198"\''></iframe>`); 
        $scope.module = module;
    });
    $scope.feedback = new InspectionInfo({
        utms: utils.getUtms()
    });
    angular.forEach(InspectionInfo.prototype.schema.paths, function(path, name){
        if(path.options.goal){
            $scope.$watch(`feedback.${name}`, function(value){
                if(name==='car' && ((
                        typeof value !== 'object'
                    ) || (
                        isEmpty(value) ||
                        isEmpty(value.label) && 
                        isEmpty(value.fullLabel)
                    )
                )){
                    return;
                }
                if(!isEmpty(value)){
                    utils.reachGoal(
                        path.options.goal===true ? 
                        `path-${name}` : path.options.goal
                    );
                }
            });
        }
    });
    $scope.submit = ()=>{
        $scope.feedback.$save(()=>{
            utils.reachGoal('GET_TO_SEND', 'LEAD');
        });
    }
    $scope.$watch('feedback.pay', (value, oldValue)=>{
        if(value && value!==oldValue){
            utils.reachGoal('PAY_ONLINE_BTN');
        }
    });
    $scope.$watch('feedbackForm', (value, oldValue)=>{
        if(value&&oldValue!=value){
            utils.reachGoal('BUY_TO_BTN');
        }

    });
    $scope.$watch('feedback.car.brand', (brand)=>{
        if(typeof(brand)=='object'){
            delete $scope.feedback.category;
        }
        $window.scrollTo(0, 0);
    });
    $scope.$watch('feedback.car', (car)=>{
        if(typeof(car)=='object'){
            delete $scope.feedback.category;
        }
    });
    $scope.$watch('initial', function(initial){
        $scope.feedback = utils.kkUpdateInitial($scope.feedback, initial);
    });
}
