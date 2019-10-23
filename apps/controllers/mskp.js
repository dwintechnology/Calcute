'use strict';
module.exports = function MSKPController($scope, $location, $timeout, $window, Feedback, DiscountInfo, utils){
    var car = undefined;
    var counter = $window.yaCounter11137381;
    $scope.startCalc = function(){
        utils.reachGoal('start_calc', null, counter);
        $scope.feedbackForm = true;
    }
    $scope.$watch('initialCar', function(newCar){
        if(newCar){
            car = newCar;
            $scope.reInitAll(true);
        }
    });
    $scope.$watch('feedback._id', function(v){
        if(v){
            utils.reachGoal('half_sent', 'LEAD', counter);
        }
    });
    $scope.$watch('discountInfo._id', function(v){
        if(v){
            utils.reachGoal('full_sent', 'LEAD_BONUS', counter);
        }
    });
    $scope.$watch('feedback.type', function(v){
        if(v) {
            if(v.indexOf('КАСКО') !== -1) {
                utils.reachGoal('KASKO_BTN', null, counter);
            }
            else {
                utils.reachGoal('OSAGO_BTN', null, counter);
            }
        }
    });
    $scope.reInitAll = function(formExists){
        $scope.discountForm = false;
        $scope.feedbackForm = Boolean(formExists);
        $scope.discountInfo = new DiscountInfo();
        $scope.feedback = new Feedback({car: car, utms: utils.getUtms(), project: 'mp', formUrl: $location.href});
    };
    $scope.reInitAll();
    $scope.$watch('initial', function(initial){
        $scope.feedback = utils.kkUpdateInitial($scope.feedback, initial);
    });
}
