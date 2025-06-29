// Initialize tasks array to store data (in production, use a database)
let tasks = [];

export async function GET(request) {
    try {
        return Response.json({ 
            message: 'Tasks retrieved successfully', 
            tasks: tasks 
        }, { status: 200 });
    } catch (error) {
        return Response.json({ 
            message: 'Error retrieving tasks' 
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { title } = await request.json();
        
        if (!title) {
            return Response.json({ 
                message: 'Title is required' 
            }, { status: 400 });
        }

        const newTask = {
            id: Date.now(),
            title: title,
            completed: false
        };
        
        tasks.push(newTask);
        
        return Response.json({ 
            message: 'Task created successfully', 
            task: newTask 
        }, { status: 201 });
    } catch (error) {
        return Response.json({ 
            message: 'Error creating task' 
        }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { id } = await request.json();
        
        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            return Response.json({ 
                message: 'Task updated successfully', 
                task: tasks[taskIndex] 
            }, { status: 200 });
        } else {
            return Response.json({ 
                message: 'Task not found' 
            }, { status: 404 });
        }
    } catch (error) {
        return Response.json({ 
            message: 'Error updating task' 
        }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        
        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        
        if (taskIndex !== -1) {
            const deletedTask = tasks.splice(taskIndex, 1)[0];
            return Response.json({ 
                message: 'Task deleted successfully', 
                task: deletedTask 
            }, { status: 200 });
        } else {
            return Response.json({ 
                message: 'Task not found' 
            }, { status: 404 });
        }
    } catch (error) {
        return Response.json({ 
            message: 'Error deleting task' 
        }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        // Clear all tasks
        tasks.length = 0;
        
        return Response.json({ 
            message: 'All tasks cleared successfully',
            tasks: tasks 
        }, { status: 200 });
    } catch (error) {
        return Response.json({ 
            message: 'Error clearing tasks' 
        }, { status: 500 });
    }
}
