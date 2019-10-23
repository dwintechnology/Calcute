'use strict';
module.exports = ['$document', '$window', function($document, $window){
  return {

    getUtms: function(){
        var params = $document[0].location.href.split(/(\?#1)|\?/),
            utms = {};
        if(params.length>1){
            decodeURIComponent(params[2]).split('&').forEach(function(sub){
                var pv = sub.split('=');
                utms[pv[0]] = [pv[1].replace(/\+/g, ' ')];
            });
        }
        return utms;
    },

    reachGoal: function(yaId, gaId, counter){
        if(!counter) {
            counter = $window.yaCounter19745419;
        }
        if(yaId && counter){
            counter.reachGoal(yaId);
        }
        else {
            console.warn('Tried to reach ya goal ' + yaId +' but counter is not installed');
        }
        if(gaId && $window.ga){
            $window.ga('send', 'event', 'btn', 'click', gaId);
        }
        else {
            console.warn('Tried to reach ga goal ' + gaId +' but counter is not installed');
        }
    },

    kkUpdateInitial: function(obj, initial){
        var utmIds = {
            'YandexDirect': 1,
            'GoogleAdwords': 2,
            'Рекламная сеть Яндекса': 3,
            'Google adsence': 4
        };
        if(initial){
            angular.forEach(initial, function(v, k){
                switch(k){
                  case 'utms':
                    if (angular.isObject(obj.utms)){
                        obj.utms = Object.assign(obj.utms, v);
                        break;
                    }
                  case 'formUrl':
                    if(obj[k]){
                      break;
                    }
                  default:
                    obj[k] = v;
                }
            });
        }
        if(angular.isObject(obj.utms)){
            var utms = obj.utms;
            if(!obj.utmSource&&angular.isObject(utms.utm_source)&&utms.utm_source.length){
                obj.utmSource = utms.utm_source[0]; 
                obj.utmSourceId = utmIds[utms.utm_source[0]]; 
            } else if(!obj.seoQuery&&angular.isObject(utms.keyword)&&utms.keyword.length){
                obj.seoQuery = utms.keyword[0]; 
            }
        }
        return obj;
    },

  };
}];
