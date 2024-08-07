function createTasksTableFromJSON(json) {
  const tasks = JSON.parse(json);
  const table = document.getElementById('tasksTable');
  let statusArray = []; 
  const headers = ['Event ID', 'Task Name', 'Status'];
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  const tbody = table.createTBody();
  tasks.forEach(task => {
    const tableRow = tbody.insertRow();
    const cellEventId = tableRow.insertCell();
    cellEventId.textContent = task.eventid || ''; 

    const cellTaskName = tableRow.insertCell();
    cellTaskName.textContent = task.taskname || ''; 

    const statusCell = tableRow.insertCell();
    const select = document.createElement('select');


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

    const currentStatus = task.status || 'Not Started';
    select.value = currentStatus;
    const currentEventStatus = localStorage.getItem('currentEventStatus');
    if (currentEventStatus === 'Failed') {
      notStartedOption.setAttribute('disabled', 'disabled');
      inProgressOption.setAttribute('disabled', 'disabled');
    }
    select.addEventListener('change', (event) => {
      const selectedStatus = event.target.value;
      const eventId = task.eventid;
      const taskName = task.taskname;
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
      localStorage.setItem('statusArray', JSON.stringify(statusArray));
    });

    statusCell.appendChild(select);
  });

  const storedStatusArray = localStorage.getItem('statusArray');
  if (storedStatusArray) {
    statusArray = JSON.parse(storedStatusArray);
 
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
