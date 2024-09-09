const reminders = [];
const currentDate = new Date();
const calendarBody = document.getElementById("calendar-body");
const currentMonthYear = document.getElementById("current-month-year");



function createEventElement(event) {
    const eventItem = document.createElement("div");
    eventItem.className = "event-item";
    eventItem.innerHTML = `
        <p>事件名称：${event.name}</p>
        <p>事件日期：${event.date}</p>
        <button class="delete-event" data-date="${event.date}">删除</button>
    `;
    return eventItem;
  }

  function renderCalendar(date) {
    calendarBody.innerHTML = ""; // 清空当前的日历
  
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
  
    let currentRow = document.createElement("tr");
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement("td");
      currentRow.appendChild(emptyCell);
    }
  
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      if (currentRow.children.length === 7) {
        // If the current row is full, append it to the table and create a new row
        calendarBody.appendChild(currentRow);
        currentRow = document.createElement("tr");
      }
  
      const cell = document.createElement("td");
      cell.textContent = day;
      const hasEvent = checkEvent(day, date.getMonth(), date.getFullYear());
      if (hasEvent) {
        cell.classList.add("event");
      }
  
      cell.addEventListener("click", () => {
        showEventsForDate(day, date.getMonth(), date.getFullYear());
      });
  
      currentRow.appendChild(cell);
    }
  
    // Append the last row
    if (currentRow.children.length > 0) {
      calendarBody.appendChild(currentRow);
    }
  
    currentMonthYear.textContent = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  }
  
  



  function addReminder() {
    const eventName = document.getElementById("event-name").value;
    const eventDate = document.getElementById("event-date").value;
  
    // Add the reminder to the reminders array
    reminders.push({ name: eventName, date: eventDate });
  
    // Store the reminders in localStorage
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Create and add the new event element
    const eventItem = document.createElement("div");
    eventItem.className = "event-item";
    eventItem.innerHTML = `
        <p>事件名称：${eventName}</p>
        <p>事件日期：${eventDate}</p>
    `;
    eventList.appendChild(eventItem);
  
    // Clear the input fields
    document.getElementById("event-name").value = "";
    document.getElementById("event-date").value = "";
  
    // Re-render the calendar
    renderCalendar(currentDate);
  }
  
  function showEventsForDate(day, month, year) {
    const dateString = `${year}-${month + 1}-${day}`;
    const eventsForDate = reminders.filter((reminder) => reminder.date === dateString);
  
    const eventList = document.createElement("div");
    eventList.className = "event-list-popup";
  
    eventsForDate.forEach((event) => {
      const eventItem = createEventElement(event);
      eventList.appendChild(eventItem);
    });
  
    const deleteAllButton = document.createElement("button");
    deleteAllButton.textContent = "删除当日所有事件";
    deleteAllButton.addEventListener("click", () => {
      deleteEventsForDate(dateString);
      eventList.remove();
    });
    eventList.appendChild(deleteAllButton);
  
    document.body.appendChild(eventList);
  
    eventList.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-event")) {
        const dateToDelete = e.target.getAttribute("data-date");
        deleteEvent(dateToDelete);
        e.target.parentElement.remove();
      }
    });
  }
  
  function deleteEvent(date) {
    reminders = reminders.filter((reminder) => reminder.date !== date);

    // Store the updated reminders in localStorage
    localStorage.setItem('reminders', JSON.stringify(reminders));

    renderCalendar(currentDate);
}
  
function deleteEventsForDate(date) {
  reminders = reminders.filter((reminder) => reminder.date !== date);

  // Store the updated reminders in localStorage
  localStorage.setItem('reminders', JSON.stringify(reminders));

  renderCalendar(currentDate);
}


function checkEvent(day, month, year) {
  // Check if an event exists for the given date
  // You can replace this with your actual event checking logic
  const dateString = `${year}-${month + 1}-${day}`;
  return reminders.some(reminder => reminder.date === dateString);
}

document.getElementById("prev-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });
  
  document.getElementById("next-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });
  
  renderCalendar(currentDate);
  
  document.addEventListener("DOMContentLoaded", function () {
    // 获取表单和事件列表元素
    const form = document.getElementById("reminder-form");
    const eventList = document.getElementById("event-list");
  
    // 当表单提交时，添加新的提醒事件
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      addReminder();
    });
  });


//bgm
document.addEventListener('DOMContentLoaded', function () {
    // 获取表单和事件列表元素
    const form = document.getElementById('reminder-form');
    const eventList = document.getElementById('event-list');

    // 当表单提交时，添加新的提醒事件
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        addReminder();
    });

    // 添加提醒事件
    function addReminder() {
        const eventName = document.getElementById('event-name').value;
        const eventDate = document.getElementById('event-date').value;

        // 创建并添加新的事件元素
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <p>事件名称：${eventName}</p>
            <p>事件日期：${eventDate}</p>
        `;
        eventList.appendChild(eventItem);

        // 清除输入框中的内容
        document.getElementById('event-name').value = '';
        document.getElementById('event-date').value = '';
    }
});
