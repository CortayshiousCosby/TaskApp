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
        return inertia('Tasks/Index', ['tasks' => $tasks]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255', // Expect "name" field
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        $task = Task::create($validated);

        return response()->json($task, 201); // Return the created task as JSON
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        $task->update($request->all());
        return redirect()->back()->with('success', 'Task updated successfully!');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->back()->with('success', 'Task deleted successfully!');
    }
}
