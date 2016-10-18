app.factory('CommonService', function ($http, $rootScope, $log, $q, $resource) {

    var service = {};

    service.getCountries = function () {
        var deferred = $q.defer();
        return $http.get('/api/countries')
                .success(function (data) {
                    deferred.resolve(data.country);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }

    service.getStates = function () {
        var deferred = $q.defer();
        return $http.get('/api/states')
                .success(function (data) {
                    deferred.resolve(data.states);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }

    service.getCurrencies = function () {
        var deferred = $q.defer();
        return $http.get('/api/currencies')
                .success(function (data) {
                    deferred.resolve(data.currency);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }


    service.getUserDetail = function () {
        var deferred = $q.defer();
        return $http.get('/api/getuser')
                .success(function (data) {
                    deferred.resolve(data.currency);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }

    service.getStoreTypes = function () {
        var deferred = $q.defer();
        return $http.get('/api/storetype')
                .success(function (data) {
                    deferred.resolve(data.storetype);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }

    service.getCategories = function () {
        var deferred = $q.defer();
        return $http.get('/api/categories')
                .success(function (data) {
                    deferred.resolve(data.storetype);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }

    service.getPlans = function () {
        var deferred = $q.defer();
        return $http.get('/api/plans')
                .success(function (data) {
                    deferred.resolve(data.storetype);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }

	service.checkUserPlans = function () {
        var deferred = $q.defer();
        return $http.get('/api/checkuserplans')
                .success(function (data) {
                   // deferred.resolve(data.storetype);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }
	service.getUserPlanDetail = function () { 
        var deferred = $q.defer();
        return $http.get('/api/getuserplanetail')
                .success(function (data) {
                   //deferred.resolve(data.storetype);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }
    service.getPlanInfo = function (id) {
        var deferred = $q.defer();
        return $http.get('/api/plans/' + id)
                .success(function (data) {
                    deferred.resolve(data.storetype);
                }).error(function (msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });
        return deferred.promise;
    }
    
  
    return service;
});

// User Profile service
app.factory('Profile', function ($resource, Config) {

    var headers = {
        'Authorization': 'Bearer '
    };

    return $resource('/admin/profile/:id', {id: '@id'}, {
        query: {method: 'GET', headers: headers},
        paginator: {'method': 'GET', 'params': {page: '@page'}, headers: headers},
        update: {method: 'PUT', headers: headers}
    }, {
        stripTrailingSlashes: false
    });

});


// user store service
app.factory('Store', function ($resource, Config) {

    var headers = {
        'Authorization': 'Bearer '
    };

    return $resource('/admin/store/:id', {id: '@id'}, {
            query: {method: 'GET', headers: headers},
            paginator: {'method': 'GET', 'params': {page: '@page'}, headers: headers},
            update: {method: 'PUT', headers: headers},
            get: {method: 'GET', headers: headers}
        }, {
            stripTrailingSlashes: false
        });

});

app.factory('Domain', function ($resource, Config) {

    var headers = {
        'Authorization': 'Bearer '
    };

    return $resource('site/admin/user/:id', {id: '@id'}, {
        update: {method: 'PUT', headers: headers},
       
    });

});

app.factory('fileReader',function($q,$log){
    
    var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
        };
    
});


app.factory('DesignService', function ($http, Config) {

    var myObj={pagedata:[]};
    myObj.getStoreDesign = function (id) {
        return $http.get('admin/design?theme_id='+id);
      }
      
    return myObj;

});


