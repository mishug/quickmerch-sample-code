var product = angular.module('Product', [
    'ngResource',
    'ngFileUpload',
]);

product.controller('addProductCtrl', function ($scope, $http, CommonService, Category, ProductService, Upload, $routeParams, $stateParams, $location, toaster, ToasterOptions) {

    $scope.imagevalidation = false;
    $scope.editimgvalidation = false;
    $scope.submitted = false;
     $scope.imageslength = true;
    //global init
    $scope.title = 'Add a Product';
    $scope.product = [];
    $scope.files = [];
    $scope.product.stock = 0;
    $scope.product.sold = 0;
    $scope.shippingOptions = [];
    $scope.productOptions = [];
    $scope.is_need_planupdate = [];
	$scope.image_per_product = [];
	//===============check product accroding user plan===============
		CommonService.checkUserPlans().success(function (data) {
			 $scope.is_need_planupdate = data.plan_is_update; 
		});
	
	//=============check images per product===========
	CommonService.getUserPlanDetail().success(function (data) { 
				$scope.image_per_product = data.plan_detail.max_product_images;
	});
    // get logged in user
    CommonService.getUserDetail().success(function (data) {
        $scope.user = data.user;
        $scope.user.plan = data.plan;
        $scope.store = data.store;
        $scope.product.user_id = $scope.user.id;
    });

    // get countries for shipping preference
    CommonService.getCountries().success(function (data) {
        $scope.countryList = data.country;
    });

    // get getCategories 
    CommonService.getCategories().success(function (data) {
        $scope.categoriesList = data.categories;
    });

    $scope.addanothercategory = function () {
        $scope.category = !$scope.category;
    }
    $scope.newcategory = {category_name: ''};
    $scope.addCategory = function () {
        toaster.clear();
        if ($.trim($scope.newcategory.category_name) == '') {
            toaster.error('Error!', 'Category name can not be blank', ToasterOptions);
            return false;
        }
        toaster.wait('Saving..', '', ToasterOptions);
        Category.save($scope.newcategory, function (res) {
            if (!res.error) {
                toaster.clear();
                $scope.categoriesList.push(res.category);
                toaster.success('Success!', res.message, ToasterOptions);
                //toastr.success(res.message, {"timeOut": "4000", "positionClass": "toast-top-right"});
                $scope.newcategory = {category_name: ''};
            } else {
                toaster.clear();
                toaster.error('Error!', res.message, ToasterOptions);
//                $.each(res.message, function (key, msg) {
//                    toaster.clear();
//                    toaster.error('Error!', res.message, ToasterOptions);
//                    //toastr.error(msg, {"timeOut": "4000", "positionClass": "toast-top-right"});
//                });

            }
        }, function (res) {
            toaster.error('Error!', res.message, ToasterOptions);
        });

    }

    //===========delete product category=========
   $scope.deleteCategory = function () { 
       var id = $scope.product.category_id;
       if(id == undefined)
       {
          sweetAlert("Oops...", "Please select category!", "error");
          return false; 
       }
        swal({
            title: "Are you sure?",
            // text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: 'btn-danger btn-sm',
            cancelButtonClass: 'btn-default btn-sm',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: true,
            closeOnCancel: true,
        }, function () {
            Category.delete({id: id}, function (res) {
                toaster.wait('Processing...', '', ToasterOptions);
                if (!res.error) {
                    toaster.clear();
                    toaster.success('Success!', res.message, ToasterOptions);
                    $state.reload();
                } else {
                    toaster.error('Error!', res.message, ToasterOptions);
                }
            }, function (res) {
                toaster.error('Error!', res.message, ToasterOptions);
            });
            
             CommonService.getCategories().success(function (data) {
                    $scope.categoriesList = data.categories;
                });
        });
   }

    // shipping prefernces
    $scope.prefrences = {
        country: '',
        alone_price: '',
        with_price: ''
    };

    $scope.addPreferences = function () {
        if ($scope.checkExistsPreference()) {
            if ($scope.checkIfFilled('shipping', $scope.prefrences)) {
                $scope.shippingOptions.push($scope.prefrences);
            } else {
                toaster.clear();
                toaster.warning('Ooops!', 'Fill all fields for shipping, please ensure input is valid.', ToasterOptions);
            }
        } else {
            toaster.warning('Ooops!', 'Shipping preference already exist', ToasterOptions);
        }
        $scope.prefrences = {
            country: '',
            alone_price: '',
            with_price: ''
        }; /* reset active item*/
    }

    $scope.checkExistsPreference = function () {
        var exstOpt = $scope.shippingOptions;
        if (exstOpt.length > 0) {
            for (k in exstOpt) {
                if ($scope.prefrences.country.id == exstOpt[k].country.id) {
                    return false;
                }
            }
        }
        return true;
    };

    $scope.removePreference = function (country) {
        var items = $scope.shippingOptions;
        for (k in items) {
            if (country == items[k].country.id) {
                items.splice(k, 1);
            }
        }
        $scope.shippingOptions = items;
    };

    // product options / variants
    $scope.options = {
        name: '',
        stock: '',
        sold: ''
    };

    $scope.addOptions = function () {
        console.log($scope.options);
        if ($scope.checkExistsOptions()) {

            if ($scope.checkIfFilled('options', $scope.options)) {
                $scope.productOptions.push($scope.options);
            } else {
                toaster.clear();
                toaster.warning('Ooops!', 'Fill all fields for options, please enure input is valid.', ToasterOptions);
            }
        } else {
            toaster.warning('Ooops!', 'Option Name already exists', ToasterOptions);
        }

        $scope.options = {
            name: '',
            stock: '',
            sold: ''
        }; /* reset active item*/
    }

    $scope.checkExistsOptions = function () {
        var items = $scope.productOptions;
        if (items.length > 0) {
            for (k in items) {
                if ($scope.options.name == items[k].name) {
                    return false;
                }
            }
        }

        return true;
    };

    $scope.removeOptions = function (name) {
        var items = $scope.productOptions;
        //    console.log(items);
        for (k in items) {
            if (name == items[k].name) {
                items.splice(k, 1);
            }
        }
        $scope.productOptions = items;
    };

    $scope.checkprimaryimage = function () { 
         $scope.imagevalidation = true;
          $(this).attr('checked', 'checked');
         $('#primaryimg').hide();
    }

    $scope.checkprimaryeditimage = function () { 
         $scope.editimgvalidation = true;
         $(this).attr('checked', 'checked');
         $('#primaryimg').hide();
    }
    // Save Product
    $scope.addProduct = function (isValid) { 
        if (!isValid) { 
            if( $scope.files.length == '0')
            {
                 $scope.imageslength = false;
            }
            toaster.clear();
            toaster.error('Error', 'Some error(s) on form', ToasterOptions);
            return false;
        }
        else if( $scope.files.length >$scope.image_per_product)
        {
                toaster.clear();
                toaster.error('Error', 'For Add More Image, Please Update Your Plan ! ', ToasterOptions);
                return false;
        }

        else if( $scope.files.length == '0')
        {       $scope.imageslength = false;
                toaster.clear();
                toaster.error('Error', 'Some error(s) on form', ToasterOptions);
                return false;
        }
        else if($scope.is_need_planupdate == '0')
        {       
                    toaster.clear();
                toaster.error('Error', 'For Add More Product, Please Update Your Plan! ', ToasterOptions);
                return false;

        }
        else
        {
        $scope.product.shippingOptions = $scope.shippingOptions;
        $scope.product.productOptions = $scope.productOptions;

        // get stock &  sold numbers of prodcuts
        
        var names = [];
        for (var i = 0; i < $scope.files.length; i++) {
            names.push('file[' + i + ']');
        }
        toaster.wait('Saving...', '', ToasterOptions);
        Upload.upload({
            url: 'admin/product',
            headers: {'Content-Type': undefined},
            fields: $scope.product,
            fileFormDataName: names,
            file: $scope.files,
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (res) {
            toaster.clear();
            if (!res.error) {
                toaster.success('Success!', res.message, ToasterOptions);
                $location.path('/product');
            } else {
                toaster.error('Error!', res.message, ToasterOptions);
            }
        });
	}

    }
    $scope.images = [];
    $scope.upload = function (files) { 
        $scope.invalidFiles = [];
        var invalidFileName = "";
        for (var i = 0; i < files.length; i++) {
            if (files[i].type.indexOf('image') == -1) {
                //$scope.error = 'image extension of ' + files[i].name + '  not allowed, please choose a JPEG or PNG file.';
                $scope.invalidFiles.push(files[i].name);
                files.splice(i, 1);
            }
        }

        if ($scope.invalidFiles.length > 0) {
            console.log($scope.invalidFiles);
            for (var i = 0; i < $scope.invalidFiles.length; i++) {
                invalidFileName += $scope.invalidFiles[i] + ",";
            }
            toaster.clear();
            toaster.error('Invalid Files!', 'image extension of Files: ' + invalidFileName + '  not allowed,Please upload images (jpg, jpeg, png, gif)', ToasterOptions);
        }
		
        $scope.files = files; 
        if(files.length > 0)
        {
            $scope.imageslength = true;
        }
		console.log(files.length);
    };

    $scope.resetProductForm = function () {
        $scope.productForm.$setPristine();
        $scope.product = [];
        $scope.files = [];
        $scope.product.stock = 0;
        $scope.product.sold = 0;
        $scope.product.shippingOptions = [];
        $scope.product.productOptions = [];
        $scope.shippingOptions = [];
        $scope.productOptions = [];
    }

    $scope.checkIfFilled = function (arg, obj) {
        if (arg == 'shipping') {
            if (obj.country != '' && (obj.alone_price != '' && typeof obj.alone_price != 'undefined') && (obj.with_price != '' && typeof obj.with_price != 'undefined')) {
                return true;
            }

        } else if (arg == 'options') {
            if (obj.name != '' && (obj.stock != '' && typeof obj.stock != undefined) && (obj.sold != '' && typeof obj.sold != 'undefined')) {
                return true;
            }
        }

        return false;
    }

    /**
     *  @edit & @view
     *  Get param id from route param 
     *  id is product id to view and update
     *  Display for to view
     *  Display form to update
     *  
     *  @update
     *  
     */

    if ($stateParams.id) {
        var id = $stateParams.id;
        ProductService.get({id: id}, function (res) {
            if (!res.error) {
                $scope.product = res.products;
                $scope.shippingOptions = res.shipping;
                $scope.productOptions = res.options;
                $scope.title = res.products.name
                $scope.images = res.images;
                $scope.image_primary = '';
            } else {
                toaster.error('Error!', res.message, ToasterOptions);
            }
        }, function (res) {
            toaster.error('Error!', res.message, ToasterOptions);
        });
    }

    $scope.updateProduct = function (isValid) { 
        if (!isValid) {
            toaster.error('Error!', 'Some error(s) on form', ToasterOptions);
            return false;
        }
        else if( ($('.prdct-img').find('img').length > $scope.image_per_product) || ($scope.files.length >$scope.image_per_product))
        {
            toaster.clear();
            toaster.error('Error', 'For Add More Image, Please Update Your Plan ! ', ToasterOptions);
            return false;
        }
        else if($('.pimageradio:checked').length < 1)
        {
            $('#primaryimg').show();
            toaster.error('Error!', 'Some error(s) on form', ToasterOptions);
            return false;
        }
        else
        {
            $('#primaryimg').hide();
            $scope.product.shippingOptions = $scope.shippingOptions;
            $scope.product.productOptions = $scope.productOptions;

            // get stock &  sold numbers of prodcuts
            if ($scope.productOptions.length > 0) {
                var stock = 0;
                var sold = 0;
                for (var i = 0; i < $scope.productOptions.length; i++) {
                    stock = parseInt(stock) + parseInt($scope.productOptions[i].stock);
                    sold = parseInt(sold) + parseInt($scope.productOptions[i].sold);
                }

                $scope.product.stock = stock;
                $scope.product.sold = sold
            }

            var names = [];
            for (var i = 0; i < $scope.files.length; i++) {
                names.push('file[' + i + ']');
            }

            toaster.wait('Saving...', '', ToasterOptions);
            Upload.upload({
                url: 'admin/product/' + $stateParams.id,
                headers: {'Content-Type': undefined},
                fields: $scope.product,
                fileFormDataName: names,
                file: $scope.files,
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (res) {
                toaster.clear();
                toaster.success('Success!', 'Product updated successfully.', ToasterOptions);
            });
        }
    }

    $scope.checkIfChecked = function (value, which) {
        if (which == 'new') {
            $scope.product.image_primary = '';
        } else {
            $scope.product.is_primary = -1;
        }
    }

    $scope.modelAssignment = function (value, id) {
        if (value == 1) {
            $scope.product.image_primary = id;
        }
    }

    $scope.removeImage = function (index, which) {

        if (which == 'new') {
            $scope.files.splice(index, 1);
        } else if (which == 'old') {
            $http.delete('admin/image/delete/' + index).success(function (res) {
                for (var k in $scope.images) {
                    if (index == $scope.images[k].id) {
                        $scope.images.splice(k, 1);
                    }
                }
            });
        }

        if( $scope.files.length == '0')
        {       $scope.imageslength = false;

        } 
    }


});


// display all products 
product.controller('productCtrl', function ($scope, $http, ProductService, toaster, ToasterOptions) {
    $scope.dataloader = true;
    $scope.products = [];
    ProductService.get(function (res) { 
        if (!res.error) {
            $scope.products = res.products;
             $scope.dataloader = false;
        } else {
            toaster.error('Error!', res.message, ToasterOptions);
        }
    }, function (res) {
        toaster.error('Error!', res.message, ToasterOptions);
    });

    // Delete prodcut
    $scope.delete = function ($id) {

        swal({
            title: "Are you sure?",
            // text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: 'btn-danger btn-sm',
            cancelButtonClass: 'btn-default btn-sm',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: true,
            closeOnCancel: true,
        }, function () {
            ProductService.delete({id: $id}, function (res) {
                toaster.wait('Processing...', '', ToasterOptions);
                if (!res.error) {
                    toaster.clear();
                    toaster.success('Success!', res.message, ToasterOptions);
                    $scope.products.splice($id, 1);
                    for (k in $scope.products) {
                        if ($id == $scope.products[k].id) {
                            $scope.products.splice(k, 1);
                        }
                    }

                } else {
                    toaster.error('Error!', res.message, ToasterOptions);
                }
            }, function (res) {
                toaster.error('Error!', res.message, ToasterOptions);
            });
        });
    }

    // Swicth View
    $scope.swtichView = function (that) {
        $scope.view = that;
    }

});

// Prodcuts services
product.factory('ProductService', function ($resource, Config) {
    var headers = {
        'Authorization': 'Bearer '
    };

    return $resource('/admin/product/:id', {id: '@_id'}, {
        query: {method: 'GET', headers: headers},
        paginator: {'method': 'GET', 'params': {page: '@page'}, headers: headers},
        update: {method: 'PUT', headers: headers},
        get: {method: 'GET', headers: headers},
        save: {method: 'POST', headers: headers},
        delete: {method: 'DELETE', headers: headers},
        image: {method: 'DELETE', headers: headers},
    }, {
        stripTrailingSlashes: false
    });

});

// category services
product.factory('Category', function ($resource, Config) {

    var headers = {
        'Authorization': 'Bearer '
    };

    return $resource('/admin/category/:id', {id: '@id'}, {
        save: {method: 'POST', headers: headers},
        update: {method: 'PUT', headers: headers},
        get: {method: 'GET', headers: headers},
        query: {method: 'GET', headers: headers},
        paginator: {'method': 'GET', 'params': {page: '@page'}, headers: headers},
    });

});


