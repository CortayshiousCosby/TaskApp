<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Entities\Elements\PageMessage;

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
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'completed' => 'boolean',
                'due_date' => 'nullable|date',
            ]);

            $task = Task::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Task created successfully.',
                'task' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create task: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, Task $task)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'completed' => 'boolean',
                'due_date' => 'nullable|date',
            ]);

            $task->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Task updated successfully.',
                'task' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update task: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Task $task)
    {
        try {
            $task->delete();

            // Return JSON for the frontend to handle success
            return response()->json([
                'status' => 'success',
                'message' => 'Task deleted successfully.',
            ]);
        } catch (\Exception $e) {
            // Return JSON for error handling
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete task: ' . $e->getMessage(),
            ], 500);
        }
        return back()->with('pageMessage', PageMessage::success('Task deleted successfully.'));
    }
}
