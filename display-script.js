function createTableFromJSON(json) {
  const data = JSON.parse(json);
  const table = document.getElementById("fileTable");
  table.innerHTML = "";

  const headers = Object.keys(data[0] || {});
  headers.push("Status");
  headers.push("Action");

  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  const tbody = table.createTBody();
  const currentDate = new Date();
  const statusArray = JSON.parse(localStorage.getItem("statusArray")) || [];

  data.forEach((item) => {
    const row = tbody.insertRow();
    headers.forEach((header) => {
      if (header !== "Status" && header !== "Action") {
        const td = document.createElement("td");
        td.textContent = item[header] || "";
        row.appendChild(td);
      }
    });
    const startDate = new Date(item["start date"]);
    const endDate = new Date(item["end date"]);
    let status = "Not Completed"; 

    if (currentDate >= startDate && currentDate <= endDate) {
      status = "In Progress";
    } else if (currentDate > endDate) {
      status = "Failed";
    }
    if (areAnyTasksInProgress(item["eventid"])) {
      status = "In Progress";
    } else if (areAllTasksCompleted(item["eventid"])) {
      status = "Completed";
    }

    const statusCell = row.insertCell();
    statusCell.textContent = status;

    const actionCell = row.insertCell();
    const actionButton = document.createElement("button");
    actionButton.textContent = "Action";
    actionButton.className = "actionButton";
    actionCell.appendChild(actionButton);

    actionButton.addEventListener("click", function () {
      localStorage.setItem("currentEventStatus", status); 
      showTaskForEvent(item["eventid"]);
    });
  });
}

function areAllTasksCompleted(eventId) {
  const statusArray = JSON.parse(localStorage.getItem("statusArray")) || [];
  const event = statusArray.find((item) => item.eventid === eventId);
  if (event) {
    return event.tasks.every((task) => task.status === "Finished");
  }
  return false;
}

function areAnyTasksInProgress(eventId) {
  const statusArray = JSON.parse(localStorage.getItem("statusArray")) || [];
  const event = statusArray.find((item) => item.eventid === eventId);
  if (event) {
    return event.tasks.some((task) => task.status === "In Progress");
  }
  return false;
}

function showTaskForEvent(eventId) {
  const taskFileContent = localStorage.getItem("taskFileContent");
  if (taskFileContent) {
    const tasks = JSON.parse(taskFileContent).filter(
      (task) => task.eventid === eventId
    );
    localStorage.setItem("filteredTasks", JSON.stringify(tasks));
    window.location.href = "taskdisplay.html";
  }
}

const fileContent = localStorage.getItem("eventFileContent");
if (fileContent) {
  createTableFromJSON(fileContent);
}
