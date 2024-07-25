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

  // Retrieve statusArray from localStorage
  const statusArray = JSON.parse(localStorage.getItem('statusArray')) || [];

  data.forEach((item) => {
    const row = tbody.insertRow();
    headers.forEach((header) => {
      if (header !== "Status" && header !== "Action") {
        const td = document.createElement("td");
        td.textContent = item[header] || "";
        row.appendChild(td);
      }
    });

    // Determine eventId
    const eventId = item["eventid"];

    // Check if statusArray has all tasks finished for this event
    const eventStatus = getStatusForEvent(eventId, statusArray);

    const statusCell = row.insertCell();
    statusCell.textContent = eventStatus;

    const actionCell = row.insertCell();
    const actionButton = document.createElement("button");
    actionButton.textContent = "Action";
    actionButton.className = "actionButton";
    actionCell.appendChild(actionButton);

    actionButton.addEventListener("click", function () {
      showTaskForEvent(eventId);
    });
  });
}

function getStatus(startDateStr, endDateStr, currentDate) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (currentDate < startDate) {
    return "Not Completed";
  } else if (currentDate > endDate) {
    return "Failed";
  } else {
    return "In Progress";
  }
}

function getStatusForEvent(eventId, statusArray) {
  const event = statusArray.find(item => item.eventid === eventId);
  if (event) {
    const allTasksFinished = event.tasks.every(task => task.status === 'Finished');
    return allTasksFinished ? 'Finished' : 'In Progress';
  }
  return 'Not Completed'; // Default status if event not found in statusArray
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
