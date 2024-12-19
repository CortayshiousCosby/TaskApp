<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    // Display list of categories
    public function index()
    {
        if (request()->expectsJson()) {
            $categories = Category::all();
            return response()->json($categories);
        }

        return Inertia::render('Category/Index', [
            'title' => 'Categories',
            'description' => 'Add and edit categories.',
        ]);
    }

    // Store a new category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Category::create($validated);

        return response()->json(['message' => 'Category created successfully'], 201);
    }

    // Update an existing category
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update($validated);

        return redirect()->route('category.index')->with('success', 'Category updated successfully');
    }

    // Delete a category
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully',
        ], 200);
    }
}
