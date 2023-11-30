import { useQuery } from "react-query";
import { Task } from "../interfaces/task";
import { useState } from "react";

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onSave: (editedTask: Task) => void;
  }

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave}) {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="task-modal">
      <div className="task-modal-content">
        <h2>Edit Task</h2>
        <label>
          Task Name:
          <input
            type="text"
            name="task_name"
            value={editedTask.task_name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

const Tasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    isLoading,
    error,
    data: tasks = [],
  } = useQuery<Task[]>("tasks", async () => {
    const response = await fetch("http://localhost:8000/api/tasks"); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  const handleEditTask = (task) => {
    setSelectedTask(task);
  };

  const handleModalClose = () => {
    setSelectedTask(null);
  };

  const handleSaveTask = (editedTask) => {
    console.log("Saving task:", editedTask);
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
              <button onClick={() => handleEditTask(task)}>EDIT</button>
            </div>
          </div>
        ))}
      </ul>

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={handleModalClose}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default Tasks;
