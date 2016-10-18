<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use App\Model\ShippingPreference;

class Product extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'products';
    protected $fillable = ['user_id', 'store_id', 'name', 'price', 'on_sale', 'description', 'status', 'category_id', 'stock', 'sold'];

    /**
     * Get the shipping preferences for the product.
     */
    public function shipping() {
        return $this->hasMany('App\Model\ShippingPreference', 'product_id');
    }

    /**
     * Get the shipping preferences for the product.
     */
    public function options() {
        return $this->hasMany('App\Model\Options', 'product_id');
    }

    /**
     * Get the shipping preferences for the product.
     */
    public function images() {
        return $this->hasMany('App\Model\Images', 'product_id');
    }

    //return serach results
    public function scopeSearchByKeyword($query, $keyword, $id) {
        if ($keyword != '') {
            $query->where(function ($query) use ($keyword, $id) {
                foreach ($keyword as $value) {
                    $query->orWhere('name', 'like', "%$value%");
                }
                $query->where('user_id', '=', $id);

                //$query->where("name", "LIKE", "%$keyword%");
                //->orWhere("phone", "LIKE", "%$keyword%");
            });
        }
        return $query;
    }

}
