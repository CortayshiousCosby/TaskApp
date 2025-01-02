<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Entities\Elements\PageMessage;
use App\Models\Category;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('category')->get();

        if (request()->expectsJson()) {
            return response()->json($tasks);
        }

        return Inertia::render('Task/Index', [
            'title' => 'Tasks',
            'description' => 'Add, edit and delete tasks.',
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'nullable|exists:categories,id',
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
        \Log::info('Request Data:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'completed' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        \Log::info('Validation Passed');
        // $task->update($validated);

        return to_route('categories.index');
        // return back()->with('pageMessage', 'Task updated successfully');
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
        // \Log::debug($request->toArray());

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
