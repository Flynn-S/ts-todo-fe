import { useMutation } from "react-query";
import { Task, TaskModalProps } from "../interfaces/taskInterfaces";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  tasks,
  onClose,
  refetch,
  isModalOpen,
}) => {
  const [editedTask, setEditedTask] = useState<Task>({
    id: "",
    task_name: "",
    description: "",
    dependencies: [],
    isCompleted: false,
    completed_at: null,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

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
      },
    }
  );

  const createNewTask = useMutation(
    (newTask: Task) =>
      fetch(`http://localhost:8000/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      }),
    {
      onSuccess: () => {
        console.log("Task created successfully!");
        refetch();
        onClose();
        console.log(tasks);
      },
      onError: (error) => {
        console.error("Error creating task:", error);
      },
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSave: React.MouseEventHandler<HTMLButtonElement> = () => {
    let updatedTask = { ...editedTask };
    if (selectedTask) {
      updatedTask = {
        ...editedTask,
        dependencies: [selectedTask.id],
      };
      console.log(updatedTask);
    }
    if (task) {
      console.log("updating...");
      updateTask.mutate(updatedTask);
    } else {
      console.log("creating...");
      createNewTask.mutate(updatedTask);
    }
  };

  return (
    <div
      className={
        isModalOpen ? "display-block task-modal" : "display-none task-modal"
      }
    >
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
        <label>
          Dependencies:
          <select
            name="dependencies"
            value={selectedTask ? selectedTask.id : ""}
            onChange={(e) => {
              const selectedTaskID = e.target.value;

              const foundTask = tasks.find(
                (task) => task.id === selectedTaskID
              );
              setSelectedTask(foundTask || null);
            }}
          >
            <option value="">Select a Task</option>
            {tasks.map((task: Task) => (
              <option key={task.id} value={task.id}>
                {task.task_name}
              </option>
            ))}
          </select>
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

export default TaskModal;
