<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Work', 'Personal', 'Errands', 'Hobbies', 'Urgent', 'Long Term'];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['name' => $category], // Unique constraint
                [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );
        }
    }
}
