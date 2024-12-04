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

        if (request()->expectsJson()) {
            return response()->json($tasks);
        }

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

            if (request()->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Task created successfully.',
                    'task' => $task,
                ]);
            }

            return redirect()->back()->with('pageMessage', PageMessage::success('Task created successfully.'));
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to create task: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('pageMessage', PageMessage::error('Failed to create task: ' . $e->getMessage()));
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

            if (request()->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Task updated successfully.',
                    'task' => $task,
                ]);
            }

            return redirect()->back()->with('pageMessage', PageMessage::success('Task updated successfully.'));
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to update task: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('pageMessage', PageMessage::error('Failed to update task: ' . $e->getMessage()));
        }
    }

    public function destroy(Task $task)
    {
        try {
            $task->delete();

            if (request()->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Task deleted successfully.',
                ]);
            }

            return redirect()->back()->with('pageMessage', PageMessage::success('Task deleted successfully.'));
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to delete task: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('pageMessage', PageMessage::error('Failed to delete task: ' . $e->getMessage()));
        }
    }
}
