<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    // Allow mass assignment for these attributes
    protected $fillable = ['name', 'category', 'description', 'completed', 'due_date'];



    protected $attributes = [
        'completed' => false, // Default task status is "not completed"
    ];

    // Cast attributes to native types
    protected $casts = [
        'completed' => 'boolean', // Ensure completed is treated as boolean
        'due_date' => 'datetime', // Parse due_date as a Carbon instance
    ];
}
