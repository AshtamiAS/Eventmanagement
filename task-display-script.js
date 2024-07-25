function createTasksTableFromJSON(json) {
  const tasks = JSON.parse(json);
  const table = document.getElementById('tasksTable');
  let statusArray = []; // Array to hold status information

  // Define headers and create table header
  const headers = ['Event ID', 'Task Name', 'Status'];
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  // Create table body
  const tbody = table.createTBody();
  tasks.forEach(task => {
    const tableRow = tbody.insertRow();
    const cellEventId = tableRow.insertCell();
    cellEventId.textContent = task.eventid || ''; // Adjust key name if needed

    const cellTaskName = tableRow.insertCell();
    cellTaskName.textContent = task.taskname || ''; // Adjust key name if needed

    const statusCell = tableRow.insertCell();
    const select = document.createElement('select');
    
    // Create status options
    const notStartedOption = document.createElement('option');
    notStartedOption.textContent = 'Not Started';
    notStartedOption.value = 'Not Started';
    const inProgressOption = document.createElement('option');
    inProgressOption.textContent = 'In Progress';
    inProgressOption.value = 'In Progress';
    const finishedOption = document.createElement('option');
    finishedOption.textContent = 'Finished';
    finishedOption.value = 'Finished';
    select.appendChild(notStartedOption);
    select.appendChild(inProgressOption);
    select.appendChild(finishedOption);

    // Set the current status if available
    const currentStatus = task.status || 'Not Started'; // Default to 'Not Started'
    select.value = currentStatus;

    // Add event listener to update status array
    select.addEventListener('change', (event) => {
      const selectedStatus = event.target.value;
      const eventId = task.eventid;
      const taskName = task.taskname;

      // Update statusArray
      const eventIndex = statusArray.findIndex(item => item.eventid === eventId);
      if (eventIndex !== -1) {
        const taskIndex = statusArray[eventIndex].tasks.findIndex(t => t.taskname === taskName);
        if (taskIndex !== -1) {
          statusArray[eventIndex].tasks[taskIndex].status = selectedStatus;
        } else {
          statusArray[eventIndex].tasks.push({ taskname: taskName, status: selectedStatus });
        }
      } else {
        statusArray.push({
          eventid: eventId,
          tasks: [{ taskname: taskName, status: selectedStatus }]
        });
      }

      // Store updated statusArray in localStorage
      localStorage.setItem('statusArray', JSON.stringify(statusArray));
    });

    statusCell.appendChild(select);
  });

  // Initialize statusArray from localStorage if available
  const storedStatusArray = localStorage.getItem('statusArray');
  if (storedStatusArray) {
    statusArray = JSON.parse(storedStatusArray);
    // Update table select elements based on stored data
    Array.from(table.getElementsByTagName('select')).forEach(select => {
      const eventId = select.closest('tr').querySelector('td').textContent;
      const taskName = select.closest('tr').querySelectorAll('td')[1].textContent;
      const event = statusArray.find(item => item.eventid === eventId);
      if (event) {
        const task = event.tasks.find(t => t.taskname === taskName);
        if (task) {
          select.value = task.status;
        }
      }
    });
  }
}

const filteredTasks = localStorage.getItem('filteredTasks');
if (filteredTasks) {
  createTasksTableFromJSON(filteredTasks);
}
