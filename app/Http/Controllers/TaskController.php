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
        $tasks = Task::with('category')->get(); // Include category relationship

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
                'category_id' => 'required|exists:categories,id', // Updated to category_id
                'description' => 'nullable|string',
                'completed' => 'boolean',
                'due_date' => 'nullable|date',
            ]);

            $task = Task::create($validated);

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Task created successfully.',
                    'task' => $task,
                ]);
            }

            return redirect()->back()->with('pageMessage', PageMessage::success('Task created successfully.'));
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
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
                'category_id' => 'required|exists:categories,id', // Updated to category_id
                'description' => 'nullable|string',
                'completed' => 'boolean',
                'due_date' => 'nullable|date',
            ]);

            $task->update($validated);

            $pageMessage = PageMessage::success('Task updated successfully.');

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Task updated successfully.',
                    'task' => $task,
                    'pageMessage' => $pageMessage->toArray(),
                ]);
            }

            return redirect()->back()->with('pageMessage', $pageMessage);
        } catch (\Exception $e) {
            $pageMessage = PageMessage::error('Failed to update task: ' . $e->getMessage());

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to update task.',
                    'pageMessage' => $pageMessage->toArray(),
                ], 500);
            }

            return redirect()->back()->with('pageMessage', $pageMessage);
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

    public function deleteMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:tasks,id',
        ]);

        try {
            Task::whereIn('id', $validated['ids'])->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Selected tasks deleted successfully.',
                ]);
            }

            return redirect()->back()->with('pageMessage', PageMessage::success('Selected tasks deleted successfully.'));
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to delete selected tasks: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('pageMessage', PageMessage::error('Failed to delete selected tasks: ' . $e->getMessage()));
        }
    }
}
