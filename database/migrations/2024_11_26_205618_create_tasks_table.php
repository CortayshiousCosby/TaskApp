<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Task name
            $table->string('category'); // Task category
            $table->text('description')->nullable(); // Optional task description
            $table->boolean('completed')->default(false); // Task completion status
            $table->timestamp('due_date')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps(); // Created and updated timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
