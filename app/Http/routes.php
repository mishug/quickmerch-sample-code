<?php
use Illuminate\Support\Facades\Auth;
/**
 * Back-end Routes
 * Store Admin
 * @admin prefix
 */
Route::group(['middleware' => ['auth'], 'namespace' => 'Backend', 'prefix' => 'admin'], function() {

    Route::get('/', function() { 
        return View::make('admin/index');
    });

    // product routes
    Route::resource('product', 'ProductController');
    Route::post('product/{id}', 'ProductController@update');
    
