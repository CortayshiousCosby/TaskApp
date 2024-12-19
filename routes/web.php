<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

// Dashboard route
Route::get('/', [HomeController::class, 'index'])->name('dashboard.index');

// Task resource routes for handling CRUD operations
Route::resources([
    'tasks' => TaskController::class,
    'category' => CategoryController::class,
]);

// API routes for JSON data
Route::prefix('api')->group(function () {
    // Task routes
    Route::get('/tasks', [TaskController::class, 'index'])->name('api.tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('api.tasks.store');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('api.tasks.update'); // Explicit PUT route
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('api.tasks.destroy'); // Explicit DELETE route
    Route::delete('/tasks/delete-multiple', [TaskController::class, 'deleteMultiple'])->name('api.tasks.deleteMultiple');

    // Category routes
    Route::get('/category', [CategoryController::class, 'index'])->name('api.category.index');
    Route::post('/category', [CategoryController::class, 'store'])->name('api.category.store');
    Route::put('/category/{category}', [CategoryController::class, 'update'])->name('api.category.update'); // Explicit PUT route
    Route::delete('/category/{category}', [CategoryController::class, 'destroy'])->name('api.category.destroy'); // Explicit DELETE route
});
