<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TaskSeeder extends Seeder
{
    public function run()
    {
        Task::create([
            'name' => 'Sample Task',
            'category' => 'Testing',
            'description' => 'This is a test task',
            'completed' => false,
            'due_date' => Carbon::now()->startOfDay()->addDay(), // Midnight of the next day

        ]);

        Task::create([
            'name' => 'Learn React',
            'category' => 'Productivity',
            'description' => 'Learn react by completing a ToDo App!',
            'completed' => false,
            'due_date' => Carbon::now()->startOfDay()->addDay(), // Midnight of the next day
        ]);
    }
}
