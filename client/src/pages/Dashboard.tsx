import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Layout, Plus, CheckCircle, Clock, ListChecks, X } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
}

interface Task {
  _id: string;
  title: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Modal States
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', projectId: '', description: '' });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    try {
      const projRes = await API.get('/projects');
      setProjects(projRes.data);
      const taskRes = await API.get('/tasks'); 
      setTasks(taskRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/projects', newProject);
      setIsProjModalOpen(false);
      setNewProject({ name: '', description: '' });
      fetchData();
    } catch (err) { alert("Error creating project"); }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/tasks', newTask);
      setIsTaskModalOpen(false);
      setNewTask({ title: '', projectId: '', description: '' });
      fetchData();
    } catch (err) { alert("Error creating task. Ensure a project is selected."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-xl font-bold mb-10 flex items-center gap-2"><Layout size={24} /> Ethara AI</h1>
        <nav className="space-y-4">
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Your Projects</p>
          {projects.map(p => (
            <div key={p._id} className="p-2 rounded hover:bg-slate-800 cursor-pointer truncate text-sm font-medium"># {p.name}</div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h2>
            <p className="text-gray-500">Manage your team projects and tasks here.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsProjModalOpen(true)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
              <Plus size={18} /> New Project
            </button>
            <button onClick={() => setIsTaskModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
              <ListChecks size={18} /> Add Task
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div><p className="text-xs text-gray-400 uppercase font-bold">Total Tasks</p><h3 className="text-2xl font-bold">{tasks.length}</h3></div>
            <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Clock size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div><p className="text-xs text-gray-400 uppercase font-bold">Completed</p><h3 className="text-2xl font-bold">{tasks.filter(t => t.status === 'Done').length}</h3></div>
            <div className="bg-green-50 p-3 rounded-full text-green-600"><CheckCircle size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div><p className="text-xs text-gray-400 uppercase font-bold">Active Projects</p><h3 className="text-2xl font-bold">{projects.length}</h3></div>
            <div className="bg-purple-50 p-3 rounded-full text-purple-600"><Layout size={24}/></div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Recent Tasks</h3>
          <div className="space-y-3">
            {tasks.length > 0 ? tasks.map(t => (
              <div key={t._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-semibold text-gray-700">{t.title}</span>
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${t.status === 'Done' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{t.status}</span>
              </div>
            )) : <div className="text-center py-10 text-gray-400">No tasks found. Create your first task to get started!</div>}
          </div>
        </div>
      </div>

      {/* PROJECT MODAL */}
      {isProjModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6 text-gray-800">
              <h3 className="text-xl font-bold">New Project</h3>
              <button onClick={() => setIsProjModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <input type="text" placeholder="Project Name" required className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewProject({...newProject, name: e.target.value})} />
              <textarea placeholder="Description" className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Create Project</button>
            </form>
          </div>
        </div>
      )}

      {/* TASK MODAL */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6 text-gray-800">
              <h3 className="text-xl font-bold">Create New Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input type="text" placeholder="Task Title" required className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
              <select required className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white" onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Add Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;