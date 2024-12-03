<?php


namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;


class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();

        // Return JSON if the request expects it
        if (request()->expectsJson()) {
            return response()->json($tasks);
        }

        // Otherwise, return Inertia response
        return Inertia::render('Tasks/Index', ['tasks' => $tasks]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255', // Expect "name" field
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($validated);

        return response()->json($task, 201); // Return the created task as JSON
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return response()->json($task); // Return the updated task as JSON
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully!'], 200);
    }
}
