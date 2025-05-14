const API_URL = '/tasks';

// دالة لتحويل الأولوية لقيمة عددية
function getPriorityValue(priority) {
  if (!priority) return 0;
  switch (priority.trim().toLowerCase()) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const due_date = document.getElementById('due_date').value;
  const priority = document.getElementById('priority').value;

  try {
    await axios.post(API_URL, { title, description, due_date, priority });
    document.getElementById('task-form').reset();
    fetchTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
});

async function fetchTasks() {
  try {
    const response = await axios.get(API_URL);
    let tasks = [...response.data]; // نسخة من المهام عشان نرتبها من غير تغيير الأصلية

    console.log('Tasks from API:', tasks);

    // ترتيب المهام حسب الأولوية ثم تاريخ الاستحقاق
    tasks.sort((a, b) => {
      const priorityA = getPriorityValue(a.priority);
      const priorityB = getPriorityValue(b.priority);
      const priorityDiff = priorityB - priorityA;
      if (priorityDiff !== 0) return priorityDiff;

      const dateA = a.due_date ? new Date(a.due_date) : new Date('9999-12-31');
      const dateB = b.due_date ? new Date(b.due_date) : new Date('9999-12-31');
      return dateA - dateB;
    });

    console.log('Tasks after sorting:', tasks);

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <span>${task.title} (${task.priority || 'No Priority'}) - Due: ${task.due_date || 'N/A'}</span>
        <div>
          <button class="complete-btn" onclick="toggleComplete(${task.id}, ${!task.completed})">
            ${task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function toggleComplete(id, completed) {
  try {
    const endpoint = completed ? `${API_URL}/${id}/complete` : `${API_URL}/${id}/incomplete`;
    await axios.put(endpoint);
    fetchTasks();
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

async function deleteTask(id) {
  try {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// Initial fetch
fetchTasks();