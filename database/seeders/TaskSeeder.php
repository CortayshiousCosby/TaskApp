<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run()
    {
        Task::create([
            'name' => 'Sample Task',
            'category' => 'Testing',
            'description' => 'This is a test task',
            'completed' => false,
        ]);
    }
}
