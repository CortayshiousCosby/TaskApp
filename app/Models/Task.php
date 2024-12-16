<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Include HasFactory for factory support
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory; // Enable Laravel factory methods for this model

    public const CATEGORIES = [
        'Work',
        'Personal',
        'Errands',
        'Hobbies',
    ];

    // Allow mass assignment for these attributes
    protected $fillable = ['name', 'category', 'description', 'completed', 'due_date'];

    // Default values for attributes
    protected $attributes = [
        'completed' => false, // Default task status is "not completed"
    ];

    // Cast attributes to native types
    protected $casts = [
        'completed' => 'boolean', // Ensure completed is treated as a boolean
        'due_date' => 'datetime', // Parse due_date as a Carbon instance
    ];

    // Scopes for querying specific types of tasks
    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    public function scopePending($query)
    {
        return $query->where('completed', false);
    }

    // Accessor: Format name in title case
    public function getNameAttribute($value)
    {
        return ucwords($value);
    }

    // Mutator: Store the name in lowercase
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = strtolower($value);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($task) {
            if (!in_array($task->category, self::CATEGORIES)) {
                throw new \InvalidArgumentException('Invalid category value.');
            }
        });
    }
}
