<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

// Dashboard route
Route::get('/', [HomeController::class, 'index'])->name('dashboard.index');

// API routes for JSON data
Route::prefix('api')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index'])->name('api.tasks.index');
});

// Task resource routes for handling CRUD operations
Route::resource('/tasks', TaskController::class);
