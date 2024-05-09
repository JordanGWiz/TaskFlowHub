// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const $toDoEl = $("#todo-cards");
const $inProgressEl = $("#in-progress");
const $doneEl = $("#done");
// Todo: create a function to generate a unique task id
function generateTaskId() {
  nextId++;
  localStorage.setItem("nextId", nextId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card project-card draggable my-3")
    .attr("data-task-id", task.id);
  const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(task.description);
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  // Append delete button to the task card
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);

  // Background color based on due date
  if (task.dueDate && task.status !== "done") {
    const now = dayjs();
    const dueDate = dayjs(task.dueDate);
    if (now.isSame(dueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(dueDate)) {
      taskCard.addClass("bg-danger text-white");
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  // Clear existing task cards in each status lane
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();

  // Re-render the task list by creating new task cards
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);

    switch (task.status) {
      case "to-do":
        $("#todo-cards").append(taskCard);
        break;
      case "in-progress":
        $("#in-progress-cards").append(taskCard);
        break;
      case "done":
        $("#done-cards").append(taskCard);
        break;
    }
  });

  // Make the task cards draggable
}
// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const titleEl = $("#task-title").val();
  const dateEl = $("#task-due-date").val();
  const taskDescriptionEl = $("#task-description").val();

  generateTaskId();

  // Initialize taskList if it is null
  taskList = taskList || [];

  const newTask = {
    id: nextId,
    title: titleEl,
    dueDate: dateEl,
    description: taskDescriptionEl,
    status: "to-do",
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();

  $("#task-title").val("");
  $("#task-due-date").val("");
  $("#task-description").val("");

  $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).attr("data-task-id");

  taskList = taskList.filter((task) => task.id !== parseInt(taskId));

  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList(); // Re-render the task list after deletion
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const droppedTask = taskList.find(
    (task) => task.id === ui.item.data("task-id")
  );
  droppedTask.status = $(event.target).data("status");
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $("#saveTaskButton").click(function (event) {
    handleAddTask(event);
  });

  $("#todo-cards, #in-progress-cards, #done-cards").sortable({
    connectWith: ".card-list",
    receive: handleDrop,
  });

  renderTaskList();
});
