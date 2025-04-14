import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [regularTasks, setRegularTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progress, setProgress] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [newTask, setNewTask] = useState({ title: '', priority: 1, tags: '' });
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NjkxMjU1LCJpYXQiOjE3NDQ2MDQ4NTUsImp0aSI6IjI1YTU3YTQ3ZmJkYzQ4YzZiNzJlNjQyYjVjYTIxYTBlIiwidXNlcl9pZCI6MX0.HL5k6ff6jaVD9yxRgJ3bQE3fz8BzUay-VFPEYdVmw-A'; 

  const fetchTasks = () => {
    const urgentUrl = `http://localhost:8000/api/v1/urgent-tasks/${priorityFilter ? `?priority=${priorityFilter}` : ''}${tagFilter ? `${priorityFilter ? '&' : '?'}tag=${tagFilter}` : ''}`;
    const regularUrl = `http://localhost:8000/api/v1/regular-tasks/${priorityFilter ? `?priority=${priorityFilter}` : ''}${tagFilter ? `${priorityFilter ? '&' : '?'}tag=${tagFilter}` : ''}`;

    fetch(urgentUrl, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Urgent fetch failed: ${res.status}`))
      .then(data => setUrgentTasks(data))
      .catch(err => console.log(err));

    fetch(regularUrl, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Regular fetch failed: ${res.status}`))
      .then(data => setRegularTasks(data))
      .catch(err => console.log(err));
  };

  const fetchProgress = (taskId) => {
    fetch(`http://localhost:8000/api/v1/urgent-tasks/${taskId}/progress/`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Progress fetch failed: ${res.status}`))
      .then(data => setProgress(data.progress))
      .catch(err => console.log(err));
  };

  const addTask = () => {
    fetch('http://localhost:8000/api/v1/urgent-tasks/', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTask.title,
        priority: newTask.priority,
        tags: newTask.tags.split(',').map(t => t.trim()).filter(t => t),
      }),
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Add task failed: ${res.status}`))
      .then(() => {
        setNewTask({ title: '', priority: 1, tags: '' });
        fetchTasks();
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchTasks();
  }, [priorityFilter, tagFilter]);

  const renderTask = (task, level = 0) => {
    return (
      <div key={task.id} style={{ marginLeft: `${level * 20}px` }}>
        <div
          style={{ color: task.priority >= 3 ? 'red' : 'blue', cursor: 'pointer' }}
          onClick={() => {
            setSelectedTask(task);
            if (task.subtasks?.length) fetchProgress(task.id);
          }}
        >
          {task.title} {task.subtasks?.length > 0 ? `(+${task.subtasks.length})` : ''} {task.status.completed ? '✅' : ''}
        </div>
        {task.subtasks?.map(subTask => renderTask(subTask, level + 1))}
      </div>
    );
  };

  return (
    <div className="app">
      <h1>TaskAPI Dashboard</h1>
      <div className="filters">
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input
          placeholder="Filter by tag (e.g., work)"
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
        />
      </div>
      <div className="add-task">
        <input
          placeholder="New task title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={e => setNewTask({ ...newTask, priority: parseInt(e.target.value) })}
        >
          {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input
          placeholder="Tags (comma-separated)"
          value={newTask.tags}
          onChange={e => setNewTask({ ...newTask, tags: e.target.value })}
        />
        <button onClick={addTask}>Add Urgent Task</button>
      </div>
      <div className="tasks">
        <h2>Urgent Tasks</h2>
        {urgentTasks.length ? urgentTasks.map(task => renderTask(task)) : <p>No urgent tasks</p>}
        <h2>Regular Tasks</h2>
        {regularTasks.length ? regularTasks.map(task => renderTask(task)) : <p>No regular tasks</p>}
      </div>
      {selectedTask && (
        <div className="details">
          <h3>{selectedTask.title}</h3>
          <p>Priority: {selectedTask.priority}</p>
          <p>Deadline: {selectedTask.deadline?.date || 'None'}</p>
          <p>Status: {selectedTask.status.completed ? 'Done' : 'Pending'}</p>
          <p>Tags: {selectedTask.tags?.length ? selectedTask.tags.join(', ') : 'None'}</p>
          <p>Comments: {selectedTask.comments?.length ? selectedTask.comments.join(', ') : 'None'}</p>
          <p>Assignments: {selectedTask.assignments?.map(a => `${a.user} (${a.role})`).join(', ') || 'None'}</p>
          <p>Project: {selectedTask.project || 'None'}</p>
          <p>Dependencies: {selectedTask.dependencies?.length ? selectedTask.dependencies.map(d => d.title).join(', ') : 'None'}</p>
          <p>Depth: {selectedTask.depth || 0}</p>
          {progress !== null && <p>Progress: {progress}%</p>}
        </div>
      )}
    </div>
  );
}

export default App;