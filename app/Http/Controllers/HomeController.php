<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Home', [
            'title' => 'Task Manager',
            'greeting' => 'Welcome! Let’s get productive and manage your tasks.',
        ]);
    }
}
