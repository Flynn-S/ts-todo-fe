import { useQuery, useMutation } from "react-query";
import { Task } from "../interfaces/taskInterfaces";
import TaskModal from "./TaskModal";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const Tasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading,
    error,
    data: tasks = [],
    refetch,
  } = useQuery<Task[]>("tasks", async () => {
    const response = await fetch("http://localhost:8000/api/tasks");
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

  const updateTaskStatus = useMutation(
    async (task: Task) => {
      const response = await fetch(
        `http://localhost:8000/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
    },
    {
      onSuccess: () => {
        console.log("Task status updated successfully!");
        refetch();
      },
      onError: (error) => {
        console.error("Error marking task as completed:", error);
      },
    }
  );

  const handleIsCompleted = (task: Task, isCompleted: boolean) => {
    const updatedTask: Task = {
      ...task,
      isCompleted: isCompleted,
    };
    console.log(updatedTask);
    updateTaskStatus.mutate(updatedTask);
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

  const sortedTasks = tasks.slice().sort((a, b) => {
    if (a.isCompleted === null && b.isCompleted === null) {
      return 0;
    } else if (a.isCompleted === null) {
      return 1;
    } else if (b.isCompleted === null) {
      return -1;
    }

    return a.isCompleted ? -1 : 1;
  });

  return (
    <div className="tasks-container">
      <h1>To Do List</h1>
      <ul className="task-list">
        {sortedTasks.map((task) => (
          <div
            className={
              task.isCompleted
                ? "bg-green task-card"
                : "bg-green not-complete task-card"
            }
          >
            <div className="task-left">
              <li key={task.id}>
                <h3>{task.task_name}</h3>
              </li>
              <p id={task.isCompleted ? "text-white" : ""}>
                {task.description}
              </p>
            </div>
            <div className="task-center">
              <h3>Dependancies</h3>
              <ul>
                {task.dependencies.map((task) => (
                  <li key={task.id}>{task.task_name}</li>
                ))}
              </ul>
            </div>
            <div className="task-right">
              <label>
                {task.isCompleted ? "Completed" : "In Progress"}
                <input
                  className={"isCompleted"}
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={(e) => handleIsCompleted(task, e.target.checked)}
                ></input>
              </label>
              <div className="buttons">
                <button
                  className="editButton"
                  onClick={() => handleEditTask(task)}
                >
                  <FontAwesomeIcon className="editIcon" icon={faPenToSquare} />
                  <p>Edit</p>
                </button>
                <button
                  className="deleteButton"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FontAwesomeIcon className="deleteIcon" icon={faTrash} />
                  <p>Delete</p>
                </button>
              </div>
            </div>
          </div>
        ))}
      </ul>
      <div className="add-task-container">
        <button className="addTaskButton" onClick={() => handleAddTask()}>
          <FontAwesomeIcon className="addIcon" icon={faCirclePlus} />
          <p>Add new task</p>
        </button>
      </div>

      {isModalOpen && (
        <TaskModal
          tasks={tasks}
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
