<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard route
Route::get('/', [HomeController::class, 'index'])->name('dashboard.index');

// API Route for JSON data
Route::get('/api/tasks', [TaskController::class, 'index'])->name('api.tasks.index');

// Inertia Page Route for tasks
Route::get('/tasks', function () {
    return Inertia::render('Tasks/Index');
})->name('tasks.index');

// Task resource routes for handling CRUD operations
Route::resource('/tasks', TaskController::class)->except(['index']);
