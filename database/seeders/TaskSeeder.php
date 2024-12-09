<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TaskSeeder extends Seeder
{
    public function run()
    {
        // Urgent task (due within 24 hours)
        Task::create([
            'name' => 'Urgent Task',
            'category' => 'High Priority',
            'description' => 'This task needs immediate attention.',
            'completed' => false,
            'due_date' => Carbon::now()->addHours(10), // Due within 10 hours
        ]);

        // Coming soon task (due in 1-2 days)
        Task::create([
            'name' => 'Coming Soon Task',
            'category' => 'Upcoming',
            'description' => 'This task is coming up soon.',
            'completed' => false,
            'due_date' => Carbon::now()->addHours(36), // Due in 36 hours
        ]);

        // Long-term task (due in more than 2 days)
        Task::create([
            'name' => 'Long-Term Task',
            'category' => 'Planning',
            'description' => 'This task is planned for the future.',
            'completed' => false,
            'due_date' => Carbon::now()->addDays(7), // Due in 7 days
        ]);

        // No due date task
        Task::create([
            'name' => 'No Due Date Task',
            'category' => 'Flexible',
            'description' => 'This task has no specific deadline.',
            'completed' => false,
            'due_date' => null, // No due date
        ]);

        // Completed task
        Task::create([
            'name' => 'Completed Task',
            'category' => 'Finished',
            'description' => 'This task has been completed.',
            'completed' => true,
            'due_date' => Carbon::now()->subDays(1), // Completed task with a past due date
        ]);
    }
}
