<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Allow mass assignment for these attributes
    protected $fillable = ['name', 'category_id', 'description', 'completed', 'due_date'];

    // Default values for attributes
    protected $attributes = [
        'completed' => false, // Default task status is "not completed"
    ];

    // Cast attributes to native types
    protected $casts = [
        'completed' => 'boolean', // Ensure completed is treated as a boolean
        'due_date' => 'datetime', // Parse due_date as a Carbon instance
    ];

    /**
     * Define the relationship to the Category model
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope for querying completed tasks
     */
    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    /**
     * Scope for querying pending tasks
     */
    public function scopePending($query)
    {
        return $query->where('completed', false);
    }

    /**
     * Accessor: Format name in title case
     */
    public function getNameAttribute($value)
    {
        return ucwords($value);
    }

    /**
     * Mutator: Store the name in lowercase
     */
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = strtolower($value);
    }
}
