import { useQuery, useMutation } from "react-query";
import { Task } from "../interfaces/task";
import { useState } from "react";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  refetch: () => void;
  //   onSave: (editedTask: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  onClose,
  refetch,
}) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  //   const [updatedTask, setUpdatedTask] = useState<Task | null>(null)

  const updateTask = useMutation(
    (updatedTask: Task) =>
      fetch(`http://localhost:8000/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      }),
    {
      onSuccess: () => {
        console.log("Task updated successfully!");
        refetch();
        onClose();
      },
      onError: (error: Error) => {
        console.error("Error updating task:", error);
        onClose();
      },
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSave: React.MouseEventHandler<HTMLButtonElement> = () => {
    console.log(editedTask);
    updateTask.mutate(editedTask);
  };

  const showModal = task !== null ? "display-block" : "display-none";
  return (
    <div className={`${showModal} task-modal`}>
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
        <div className="button-container">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Tasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleModalClose = () => {
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
                {/* <button onClick={() => handleDeleteTask(task)}>Delete</button> */}
              </div>
            </div>
          </div>
        ))}
      </ul>

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={handleModalClose}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default Tasks;
