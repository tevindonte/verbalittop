import React, { useState, useEffect, useContext } from "react";
import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import axios from "axios";
import { TaskContext } from "./TaskContext";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext

const MonthlyCalendar = () => {
  const { user } = useContext(AuthContext); // Access user and loading state from AuthContext
  const userId = user?._id;
  const { tasks, addTask, updateTask, deleteTask, fetchTasks } = useContext(TaskContext);
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`https://verbalitserver.onrender.com/api/users/${userId}/folders`);
        setProjects([{ id: null, name: "No Folder/Project" }, ...response.data]); // Add "No Folder/Project" option
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects.");
        setLoading(false);
      }
    };

    const fetchTasksWrapper = async () => {
      await fetchTasks(); // Call the fetchTasks function here
    };

    fetchProjects();
    fetchTasksWrapper();
  }, [userId]); // Run when userId changes

  const config = {
    eventHeight: 30,
    headerHeight: 30,
    cellHeaderHeight: 25,
    onBeforeEventRender: (args) => {
      args.data.borderColor = "darker";
      if (args.data.backColor) {
        args.data.barColor = DayPilot.ColorUtil.lighter(args.data.backColor, 1);
      }
    },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Edit",
          onClick: async (args) => {
            const task = args.source.data;

            // Create a dropdown modal for project selection
            const projectOptions = projects.map((project) => ({
              id: project._id || null,
              name: project.name,
            }));

            const form = [
              { name: "Task Name", id: "text", type: "text", value: task.text },
              { name: "Start Date", id: "start", type: "date", value: new Date(task.start).toISOString().split("T")[0] },
              { name: "End Date", id: "end", type: "date", value: new Date(task.end).toISOString().split("T")[0] },
              {
                name: "Select Project",
                id: "projectId",
                type: "select",
                options: projectOptions.map((project) => ({
                  id: project.id,
                  name: project.name,
                })),
                value: task.projectId || null, // Set the current projectId as the default value
              },
            ];

            const modal = await DayPilot.Modal.form(form);

            if (!modal.result) return;

            const { text, start, end, projectId } = modal.result;

            const updatedEvent = {
              ...task,
              _id: task._id, // Ensure _id is included
              text: text,
              start: new Date(start).toISOString(),
              end: new Date(end).toISOString(),
              projectId: projectId || null, // Update projectId
              userId, // Include userId in the updated event
            };

            try {
              await updateTask(updatedEvent); // Update the task in the backend and state
            } catch (error) {
              console.error("Error updating task:", error);
            }
          },
        },
        {
          text: "Delete",
          onClick: async (args) => {
            const taskId = args.source?.data?._id; // Use optional chaining
            const projectId = args.source?.data?.projectId || null; // Get projectId or default to null
            if (!taskId) {
              console.error("Task ID is undefined");
              return;
            }
            if (window.confirm(`Are you sure you want to delete "${args.source.data.text}"?`)) {
              try {
                await deleteTask(taskId, projectId); // Pass projectId to deleteTask
              } catch (error) {
                console.error("Error deleting task:", error);
              }
            }
          },
        },
      ],
    }),
    onTimeRangeSelected: async (args) => {
      if (loading || error) {
        alert("Projects are not available at the moment.");
        return;
      }

      // Create a dropdown modal for project selection
      const projectOptions = projects.map((project) => ({
        id: project._id || null,
        name: project.name,
      }));

      const form = [
        { name: "Task Name", id: "taskName", type: "text" },
        { name: "Start Date", id: "start", type: "date", value: args.start.toString() },
        { name: "End Date", id: "end", type: "date", value: args.end.toString() },
        {
          name: "Select Project",
          id: "projectId",
          type: "select",
          options: projectOptions.map((project) => ({
            id: project.id,
            name: project.name,
          })),
        },
      ];

      const modal = await DayPilot.Modal.form(form);

      if (!modal.result) return;

      const { taskName, start, end, projectId } = modal.result;

      const newEvent = {
        id: DayPilot.guid(),
        projectId: projectId || null, // Associate with selected project or null
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        text: taskName,
        backColor: "#d5663e",
        userId, // Include userId in the new event
      };

      try {
        await addTask(newEvent); // Add the task to the backend and update the state
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    onEventClick: async (args) => {
      const task = args.e.data;

      // Create a dropdown modal for project selection
      const projectOptions = projects.map((project) => ({
        id: project._id || null,
        name: project.name,
      }));

      const form = [
        { name: "Task Name", id: "text", type: "text", value: task.text },
        { name: "Start Date", id: "start", type: "date", value: new Date(task.start).toISOString().split("T")[0] },
        { name: "End Date", id: "end", type: "date", value: new Date(task.end).toISOString().split("T")[0] },
        {
          name: "Select Project",
          id: "projectId",
          type: "select",
          options: projectOptions.map((project) => ({
            id: project.id,
            name: project.name,
          })),
          value: task.projectId || null, // Set the current projectId as the default value
        },
      ];

      const modal = await DayPilot.Modal.form(form);

      if (!modal.result) return;

      const { text, start, end, projectId } = modal.result;

      const updatedEvent = {
        ...task,
        _id: task._id, // Ensure _id is included
        text: text,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        projectId: projectId || null, // Update projectId
        userId, // Include userId in the updated event
      };

      try {
        await updateTask(updatedEvent); // Update the task in the backend and state
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    onEventMoved: async (args) => {
      const updatedEvent = {
        ...args.e.data,
        start: args.newStart.toString(),
        end: args.newEnd.toString(),
        userId, // Include userId in the updated event
      };

      try {
        await updateTask(updatedEvent); // Update the task in the backend and state
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col w-full h-full justify-start items-center p-4 space-y-4">
      <div className="w-full flex justify-center items-center bg-white text-black p-4">
        <span className="text-xl">Monthly Calendar</span>
      </div>

      <div className="w-full h-full flex justify-center items-center bg-gray-100 rounded-lg">
        <DayPilotMonth {...config} events={tasks} startDate={startDate} />
      </div>
    </div>
  );
};

export default MonthlyCalendar;