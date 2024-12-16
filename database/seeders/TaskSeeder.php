<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TaskSeeder extends Seeder
{
    public function run()
    {
        // Task in the 'Work' category
        Task::create([
            'name' => 'Team Meeting Preparation',
            'category' => 'Work',
            'description' => 'Prepare slides and agenda for the team meeting.',
            'completed' => false,
            'due_date' => Carbon::now()->addHours(8), // Due in 8 hours
        ]);

        // Task in the 'Personal' category
        Task::create([
            'name' => 'Buy Groceries',
            'category' => 'Personal',
            'description' => 'Purchase groceries for the week.',
            'completed' => false,
            'due_date' => Carbon::now()->addDays(1), // Due tomorrow
        ]);

        // Task in the 'Errands' category
        Task::create([
            'name' => 'Post Office Visit',
            'category' => 'Errands',
            'description' => 'Drop off packages at the post office.',
            'completed' => false,
            'due_date' => Carbon::now()->addHours(30), // Due in 30 hours
        ]);

        // Task in the 'Hobbies' category
        Task::create([
            'name' => 'Painting Class',
            'category' => 'Hobbies',
            'description' => 'Attend painting class at the community center.',
            'completed' => false,
            'due_date' => Carbon::now()->addDays(3), // Due in 3 days
        ]);

        // A long-term task in the 'Work' category
        Task::create([
            'name' => 'Project Deadline',
            'category' => 'Work',
            'description' => 'Complete the project and submit it to the client.',
            'completed' => false,
            'due_date' => Carbon::now()->addWeeks(1), // Due in 7 days
        ]);

        // A completed task in the 'Personal' category
        Task::create([
            'name' => 'Morning Run',
            'category' => 'Personal',
            'description' => 'Go for a 5km run in the park.',
            'completed' => true,
            'due_date' => Carbon::now()->subDays(1), // Completed yesterday
        ]);

        // A task with no due date in the 'Hobbies' category
        Task::create([
            'name' => 'Learn Guitar',
            'category' => 'Hobbies',
            'description' => 'Practice guitar chords and scales.',
            'completed' => false,
            'due_date' => null, // No due date
        ]);
    }
}
