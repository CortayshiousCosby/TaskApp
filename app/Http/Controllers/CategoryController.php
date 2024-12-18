<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {

        if (request()->expectsJson()) {
            // Fetch all categories
            $categories = Category::all();

            return response()->json($categories);
        }

        return Inertia::render('Categories/Index', [
            'title' => 'Categories',
            'description' => 'Add and edit categories.',
        ]);
    }
}
