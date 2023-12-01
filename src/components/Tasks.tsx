import { useQuery } from "react-query";
import { Task } from "../interfaces/taskInterfaces";
import TaskModal from "./TaskModal";
import { useState } from "react";

const Tasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading,
    error,
    data: tasks = [],
    refetch,
  } = useQuery<Task[]>("tasks", async () => {
    const response = await fetch("http://localhost:8000/api/tasks"); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    refetch();

    return response.json();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error?.message ?? "An error occurred"}</div>;
  }

  return (
    <div className="tasks-container">
      <h1>To Do List</h1>
      <ul className="task-list">
        {tasks.map((task) => (
          <div className="task-card">
            <div className="task-left">
              <li key={task.id}>
                <h3>{task.task_name}</h3>
              </li>
              <p>{task.description}</p>
            </div>
            <div className="task-right">
              <input type="checkbox"></input>
              <div className="buttons">
                <button onClick={() => handleEditTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </ul>
      <div className="add-task-container">
        <button onClick={() => handleAddTask()}>Add new task</button>
      </div>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={handleModalClose}
          refetch={refetch}
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default Tasks;
