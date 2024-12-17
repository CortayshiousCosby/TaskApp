<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Models\Task;
use App\Models\Category;

class TaskSeeder extends Seeder
{
    public function run()
    {
        // Ensure categories exist
        $workCategory = Category::where('name', 'Work')->first();
        $personalCategory = Category::where('name', 'Personal')->first();
        $errandsCategory = Category::where('name', 'Errands')->first();
        $hobbiesCategory = Category::where('name', 'Hobbies')->first();

        // Check if categories were found
        if (!$workCategory || !$personalCategory || !$errandsCategory || !$hobbiesCategory) {
            $this->command->error('Categories are missing. Run the CategorySeeder first.');
            return;
        }

        // Task in the 'Work' category
        Task::create([
            'name' => 'Team Meeting Preparation',
            'category_id' => $workCategory->id,
            'description' => 'Prepare slides and agenda for the team meeting.',
            'completed' => false,
            'due_date' => Carbon::now()->addHours(8), // Due in 8 hours
        ]);

        // Task in the 'Personal' category
        Task::create([
            'name' => 'Buy Groceries',
            'category_id' => $personalCategory->id,
            'description' => 'Purchase groceries for the week.',
            'completed' => false,
            'due_date' => Carbon::now()->addDays(1), // Due tomorrow
        ]);

        // Task in the 'Errands' category
        Task::create([
            'name' => 'Post Office Visit',
            'category_id' => $errandsCategory->id,
            'description' => 'Drop off packages at the post office.',
            'completed' => false,
            'due_date' => Carbon::now()->addHours(30), // Due in 30 hours
        ]);

        // Task in the 'Hobbies' category
        Task::create([
            'name' => 'Painting Class',
            'category_id' => $hobbiesCategory->id,
            'description' => 'Attend painting class at the community center.',
            'completed' => false,
            'due_date' => Carbon::now()->addDays(3), // Due in 3 days
        ]);
    }
}
