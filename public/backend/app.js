var app = angular.module('QuickmerchApp', [
    'ngRoute',
    'ngMessages',
    'base64',
    'ngResource',
    'ngCookies',
    'Product',
    'colorpicker.module',
    'ngFileUpload',
    'ngStorage',
    'ui.bootstrap',
    'toaster',
    'ui.router',
    'angularUtils.directives.dirPagination',
    'djds4rce.angular-socialshare',
    'googlechart',
]);

app.config(function ($stateProvider, Config) { 
    $stateProvider
            .state('adminLayout', {
                abstract: true,
                url: '',
                templateUrl: Config.viewsPath + 'layouts/mainLayout.html',
                controller: 'dashboardCtrl'
            })
            .state('themepreview', {
                abstract: true,
                url: '',
                templateUrl: Config.viewsPath + 'layouts/themeLayout.html',
            })
            .state('pricing', {
                abstract: true,
                url: '',
                templateUrl: Config.viewsPath + 'layouts/pricing.html',
            })
            .state('admin', {
                url: '',
                templateUrl: Config.viewsPath + 'dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            })
            .state('admin.dashboard', {
                url: '/',
                templateUrl: Config.viewsPath + 'dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            })
            .state('adminLayout.product', {
                url: '/product',
                templateUrl: Config.viewsPath + 'product/product.html',
                controller: 'productCtrl'
            })
            .state('adminLayout.product-add', {
                url: '/product/add',
                templateUrl: Config.viewsPath + 'product/add.html',
                controller: 'addProductCtrl'
            })
            .state('adminLayout.domain-add', {
                url: '/domain/add',
                templateUrl: Config.viewsPath + 'domain/add.html',
                controller: 'domainCtrl',
            })
            .state('adminLayout.product-view', {
                url: '/product/:id',
                templateUrl: Config.viewsPath + 'product/view.html',
                controller: 'addProductCtrl',
            })
            .state('adminLayout.order', {
                url: '/order',
                templateUrl: Config.viewsPath + 'order/order.html',
                controller: 'orderCtrl'
            })
            .state('adminLayout.order-view', {
                url: '/order/:id',
                templateUrl: Config.viewsPath + 'order/orderview.html',
                controller: 'orderCtrl'
            })
            .state('adminLayout.design', {
                url: '/design',
                templateUrl: Config.viewsPath + 'design/designstore.html',
                controller: 'themesCtrl',
            })
            .state('adminLayout.design-edit', {
                url: '/design/theme/edit/:id',
                templateUrl: Config.viewsPath + 'design/index.html',
                controller: 'designCtrl',
            })
            .state('adminLayout.themestore', {
                url: '/themes/store',
                templateUrl: Config.viewsPath + 'themes/themestore.html',
                controller: 'themesStoreCtrl',
            })
            .state('themepreview.theme-preview', {
                url: '/themes/:theme/preview',
                templateUrl: Config.viewsPath + 'themes/themepreview.html',
                controller: 'themesStoreCtrl',
            })
            .state('adminLayout.pages', {
                url: '/pages',
                templateUrl: Config.viewsPath + 'pages/index.html',
                controller: 'pagesCtrl'
            })
            .state('adminLayout.pages-view', {
                url: '/pages/:code',
                templateUrl: Config.viewsPath + 'pages/view.html',
                controller: 'pagesViewCtrl'
            })
            .state('adminLayout.sociallinks', {
                url: '/links',
                templateUrl: Config.viewsPath + 'sociallinks/index.html',
                controller: 'sociallinksCtrl'
            })
            .state('adminLayout.link-view', {
                url: '/links/:code',
                templateUrl: Config.viewsPath + 'sociallinks/view.html',
                controller: 'sociallinksViewCtrl'
            })
            .state('adminLayout.setting', {
                url: '/account/setting',
                templateUrl: Config.viewsPath + 'setting/setting.html',
                controller: 'settingCtrl',
            })
            .state('adminLayout.upgradeplan', {
                url: '/account/upgradeplan',
                templateUrl: Config.viewsPath + 'setting/plan.html',
                controller: 'planCtrl'
            })
            .state('adminLayout.billing', {
                url: '/billing/plan/:param',
                templateUrl: Config.viewsPath + 'payment/billing.html',
                controller: 'paymentCtrl'
            })
            .state('adminLayout.billing-success', {
                url: '/billing/success',
                templateUrl: Config.viewsPath + 'payment/paymentsuccess.html',
                controller: 'paymentCtrl'
            })
            .state('adminLayout.billing-cancel', {
                url: '/billing/cancel',
                templateUrl: Config.viewsPath + 'payment/paymentcancel.html',
                controller: 'paymentCtrl'
            })
            .state('adminLayout.profile', {
                url: '/profile',
                templateUrl: Config.viewsPath + 'setting/profile.html',
                controller: 'settingCtrl'
            })
            .state('adminLayout.profile-update', {
                url: '/profile/update',
                templateUrl: Config.viewsPath + 'setting/editprofile.html',
                controller: 'settingCtrl'
            })
            .state('adminLayout.changepassword', {
                url: '/changepassword',
                templateUrl: Config.viewsPath + '/setting/changepassword.html',
                controller: 'settingCtrl'
            })
            .state('pricing.upgradeplan', {
                url: '/upgradeplan',
                templateUrl: Config.viewsPath + '/setting/pricing.html',
                controller: 'planCtrl',
            })
            .state('pricing.billing', {
                url: '/billing/plan/:param',
                templateUrl: Config.viewsPath + 'payment/billing_expire.html',
                controller: 'paymentCtrl'
            })
            .state('adminLayout.promocode', {
                url: '/promocde',
                templateUrl: Config.viewsPath + 'promocode/index.html',
                controller: 'promocodeCtrl'
            })
            .state('adminLayout.promocode-add', {
                url: '/promocode/add',
                templateUrl: Config.viewsPath + 'promocode/add.html',
                controller: 'promocodeCtrl'
            })
            .state('adminLayout.promocode-edit', {
                url: '/promocode/edit/:id',
                templateUrl: Config.viewsPath + 'promocode/view.html',
                controller: 'promocodeCtrl'
            })
            .state('adminLayout.promote-customer', {
                url: '/store/customers',
                templateUrl: Config.viewsPath + 'promote/customers_list.html',
                controller: 'customerCtrl'
            })
            .state('adminLayout.promote-products', {
                url: '/promote/products',
                templateUrl: Config.viewsPath + 'promote/promote_products.html',
                controller: 'promoteProductCtrl'
            })
            .state('adminLayout.category', {
                url: '/category',
                templateUrl: Config.viewsPath + 'category/index.html',
                controller: 'categoryCtrl'
            })
            .state('adminLayout.category-add', {
                url: '/category/add',
                templateUrl: Config.viewsPath + 'category/add.html',
                controller: 'categoryCtrl'
            })
            .state('adminLayout.category-edit', {
                url: '/category/edit/:id',
                templateUrl: Config.viewsPath + 'category/edit.html',
                controller: 'categoryCtrl',
            })



});



app.run(function ($rootScope, $location, AuthenticationService) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var whiteList = ['pricing.billing']
        AuthenticationService.Authenticate().success(function (res) {
            app.userData = res.user;
            var plan = res.user.plan_type;
            if (plan == 1) {
                var reg = res.user.created_at.split(" ");
                var regDate = reg[0];
                var start = new Date("" + regDate + "");
                var end = new Date();
                var diff = new Date(end - start);
                var days = diff / 1000 / 60 / 60 / 24;
                if (days > 14 && toState.name != 'pricing.billing') {
                    $location.path('upgradeplan');
                }
            }
        });
    });
});

app.run(function ($FB) {
    $FB.init('1030288300344985');
});
