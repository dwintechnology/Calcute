'use strict';
module.exports = function KKCompensationController($scope, CompensationInfo, utils){
    $scope.submit = ()=>{
        $scope.feedback.$save(()=>{
            //utils.reachGoal('GET_TO_SEND');
        });
    }
    $scope.$watch('feedback.pay', (value, oldValue)=>{
        if(value && value!==oldValue){
            //utils.reachGoal('PAY_ONLINE_BTN');
        }
    });
    $scope.$watch('feedbackForm', (value, oldValue)=>{
        if(value&&oldValue!=value){
            //utils.reachGoal('BUY_TO_BTN');
        }
    });
    $scope.$watch('feedback._id', (value, oldValue)=>{
    });
    $scope.$watch('initial', function(initial){
        if(initial){
            $scope.feedback = utils.kkUpdateInitial($scope.feedback, initial);
        }
    });
    $scope.reInitAll = function(){
        $scope.feedbackForm = false;
        $scope.feedback = new CompensationInfo({
            utms: utils.getUtms(),
        });
    };
    $scope.reInitAll();
}
