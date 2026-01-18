
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import FlowBoard from './components/FlowBoard';
import HierarchyView from './components/HierarchyView';
import TaskModal from './components/TaskModal';
import { Task, TaskStatus, TaskPriority } from './types';
import { storageService } from './services/storageService';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load initial tasks
  useEffect(() => {
    const saved = storageService.getTasks();
    if (saved.length === 0) {
      // Sample data
      const sample: Task[] = [
        {
          id: '1',
          title: 'Welcome to TaskFlow Pro!',
          description: 'Try adding your first task or use AI to break this one down.',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          labels: ['Getting Started'],
          dueDate: new Date().toISOString().split('T')[0],
          parentId: null,
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(sample);
      storageService.saveTasks(sample);
    } else {
      setTasks(saved);
    }
  }, []);

  const saveToStorage = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    storageService.saveTasks(updatedTasks);
  }, []);

  const handleSaveTask = (task: Task) => {
    const exists = tasks.find(t => t.id === task.id);
    const updated = exists 
      ? tasks.map(t => t.id === task.id ? task : t)
      : [...tasks, task];
    saveToStorage(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id && t.parentId !== id);
    saveToStorage(updated);
  };

  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status } : t);
    saveToStorage(updated);
  };

  const handleAddSubtasks = (parentId: string, subtaskTitles: string[]) => {
    const newTasks: Task[] = subtaskTitles.map(title => ({
      id: Math.random().toString(36).substr(2, 9),
      title,
      description: 'AI Generated subtask',
      status: TaskStatus.INCOMPLETE,
      priority: TaskPriority.MEDIUM,
      labels: ['AI'],
      dueDate: new Date().toISOString().split('T')[0],
      parentId: parentId,
      createdAt: new Date().toISOString()
    }));
    saveToStorage([...tasks, ...newTasks]);
  };

  return (
    <HashRouter>
      <Layout>
        <div className="h-full flex flex-col relative">
          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} />} />
            <Route 
              path="/tasks" 
              element={
                <TaskList 
                  tasks={tasks} 
                  onDelete={handleDeleteTask} 
                  onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                  onUpdateStatus={handleUpdateStatus}
                  onAddSubtasks={handleAddSubtasks}
                />
              } 
            />
            <Route path="/hierarchy" element={<HierarchyView tasks={tasks} />} />
            <Route 
              path="/flow" 
              element={<FlowBoard tasks={tasks} onUpdateStatus={handleUpdateStatus} />} 
            />
          </Routes>

          {/* Persistent FAB */}
          <button
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40 group"
          >
            <ICONS.PLUS className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {isModalOpen && (
            <TaskModal
              task={editingTask}
              tasks={tasks}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveTask}
            />
          )}
        </div>
      </Layout>
    </HashRouter>
  );
};

export default App;
