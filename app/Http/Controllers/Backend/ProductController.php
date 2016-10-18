<?php

namespace App\Http\Controllers\Backend;

use Auth;
use Config;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Model\Store;
use App\Model\Product;
use App\Model\ShippingPreference;
use App\Model\Options;
use App\Model\Images;
use DB;
use App\Http\Services\BackendCommonService;
use Input;

class ProductController extends Controller {

    public function __construct() {
        
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        try {
            $products = Product::where('user_id', Auth::user()->id)->get();

            // get primary image
            foreach ($products as $key => $product) {
                $primaryImage = $product->images()->where('is_primary', '=', 1)->first();
                if (count($primaryImage)) {
                    $products[$key]['image_path'] = stripslashes($primaryImage->image_path);
                    $products[$key]['image_name'] = $primaryImage->image_name;
                } else {
                    $primaryImage = $product->images()->first();
                    if (count($primaryImage)) {
                        $products[$key]['image_path'] = stripslashes($primaryImage->image_path);
                        $products[$key]['image_name'] = $primaryImage->image_name;
                    }
                }
            }
            return response()->json(['error' => false, 'products' => $products]);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
//
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request, BackendCommonService $common) {
        $input = $request->input();
        $user = Auth::user();
        $primary = 'none';

        $validator = Validator::make($input, ['name' => 'required|unique:products,name,NULL,NULL,user_id,' . Auth::user()->id]);
        if ($validator->fails()) {
            return response()->json(['error' => true, 'message' => 'This product is already added.']);
        }


        if (isset($input['shippingOptions'])) {
            $shipping = $input['shippingOptions'];
            unset($input['shippingOptions']);
        }

        if (isset($input['productOptions'])) {
            $options = $input['productOptions'];
            unset($input['productOptions']);
        }

        if (isset($input['is_primary'])) {
            $primary = $input['is_primary'];
            unset($input['is_primary']);
        }

        // Start transaction!
        DB::beginTransaction();
        try {

            //calculate total store remaing and sold items save product 
            $totalStockItem = 0;
            $totalSoldItem = 0;
            $totaloptions = json_decode($options);
            foreach ($totaloptions as $key => $opt) {
              $totalStockItem  += $opt->stock - $opt->sold;
              $totalSoldItem  += $opt->sold;
            }
             $input['stock'] = $totalStockItem;
             $input['sold'] = $totalSoldItem;

            $product = Product::create($input);

            // save shipping
            if (isset($shipping) && !empty($shipping)) {
                $common->saveShippingPreferences($shipping, $product->id);
            }
            // save product options
            if (isset($options) && !empty($options)) {
                $common->saveProductOptions($options, $product->id);
            }

            //image uplaoding
            if (Input::hasFile('file')) {
                $files = Input::file('file');
                $common->uploadProductImages($files, $product->id, $user->id, $primary);
            }

            DB::commit();
            return response()->json(['error' => false, 'message' => 'Product added successfully.']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => true, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        if (Product::find($id)) {
            $products = Product::find($id);
            $shippingsPref = $products->shipping()->get();

            $shipping = [];
            foreach ($shippingsPref as $key => $pref) {
                $country = [];
                $country['id'] = $pref->country_id;
                $country['country'] = trim($pref->country()->get()->first()->country);
                $shipping[$key]['country'] = $country;
                $shipping[$key]['alone_price'] = $pref->alone_price;
                $shipping[$key]['with_price'] = $pref->with_price;
            }
            $options = $products->options()->get();
            $images = $products->images()->get();
            return response()->json(['error' => false, 'products' => $products, 'shipping' => $shipping, 'options' => $options, 'images' => $images]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id) {
        
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id, BackendCommonService $common) {
        $input = $request->input();
        $user = Auth::user();
        $primary = -1;

        if (isset($input['shippingOptions'])) {
            $shipping = $input['shippingOptions'];
            unset($input['shippingOptions']);
        }

        if (isset($input['productOptions'])) {
            $options = $input['productOptions'];
            unset($input['productOptions']);
        }

        if (isset($input['is_primary'])) {   // if primary is selected from new uploads
            $primary = $input['is_primary'];
            unset($input['is_primary']);
        }

        if (isset($input['image_primary'])) {   // if primary changes among exsisting
            $imagePrimary = $input['image_primary'];
            unset($input['image_primary']);
        }

        // Start transaction!
        DB::beginTransaction();
        try {

             //calculate total store remaing and sold items save product 
            $totalStockItem = 0;
            $totalSoldItem = 0;
            $totaloptions = json_decode($options);
            foreach ($totaloptions as $key => $opt) {
              $totalStockItem  += $opt->stock - $opt->sold;
              $totalSoldItem  += $opt->sold;
            }
             $input['stock'] = $totalStockItem;
             $input['sold'] = $totalSoldItem;
            //save product
            $product = Product::find($id)->update($input);

            // save shipping
            ShippingPreference::where('product_id', '=', $id)->delete();
            if (isset($shipping) && !empty($shipping)) {
                $common->saveShippingPreferences($shipping, $id);
            }
            // save product options
            Options::where('product_id', '=', $id)->delete();
            if (isset($options) && !empty($options)) {
                $common->saveProductOptions($options, $id);
            }



            //update primary image for product
            Images::where('product_id', '=', $id)->update(array('is_primary' => 0));
            if (isset($imagePrimary) && $imagePrimary != '' && $imagePrimary != null && $imagePrimary != 'undefined') {
                Images::where('id', '=', $imagePrimary)->update(array('is_primary' => 1));
            }

            //image uplaoding
            if (Input::hasFile('file')) {
                $files = Input::file('file');
                $common->uploadProductImages($files, $id, $user->id, $primary);
            }



            DB::commit();
            return response()->json(['error' => false, 'message' => 'Product updated successfully.']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => true, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        if (Product::find($id)) {
            DB::beginTransaction();
            try {

                //delete shipping options
                ShippingPreference::where('product_id', '=', $id)->delete();

                //Delete product options
                Options::where('product_id', '=', $id)->delete();

                // remove images & unlink from folder as well
                // delete product
                Product::find($id)->delete();

                DB::commit();
                return response()->json(['error' => false, 'message' => 'Product deleted successfully.']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['error' => true, 'message' => $e->getMessage()]);
            }
        }
    }

    public function imageDestroy($id) {

        if ($id) {
            DB::beginTransaction();
            try {
                $image = Images::find($id)->first();
                $filename = $image->image_path . '/' . $image->image_name;
                if (file_exists($filename)) {
                    unlink($filename);
                }
                Images::find($id)->delete();
                DB::commit();
                return response()->json(['error' => false, 'message' => 'Deleted Successfully']);
            } catch (\Exception $e) {
                DB::rollback();
                return response()->json(['error' => true, 'message' => $e->getMessage()]);
            }
        }
        return response()->json(['error' => true, 'message' => 'Image does not exsist,Please reload page.']);
    }

}
