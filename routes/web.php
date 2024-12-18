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
    'categories' => CategoryController::class,
]);

// API routes for JSON data
Route::prefix('api')->group(function () {
    // Task routes
    Route::get('/tasks', [TaskController::class, 'index'])->name('api.tasks.index');
    Route::delete('/tasks/delete-multiple', [TaskController::class, 'deleteMultiple'])->name('api.tasks.deleteMultiple');

    // Category route
    Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');
});
