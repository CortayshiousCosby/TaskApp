<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $content = [];

        $content[] = [
            'title' => 'Manage Task',
            'description' => 'Add, edit and delete tasks.',
            'icon' => '🚀',
            'parent_id' => null,
            'url' => route('tasks.index'),
        ];

        $content[] = [
            'title' => 'Manage Categories',
            'description' => 'Add and edit categories.',
            'icon' => '🔧',
            'parent_id' => null,
            'url' => route('categories.index'),
        ];
        return Inertia::render('Home/Index', [
            'title' => 'Task Manager',
            'description' => 'Welcome! Let’s get productive and manage your tasks.',
            'content' => $content,
        ]);
    }
}
