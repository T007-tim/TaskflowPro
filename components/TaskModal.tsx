
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { ICONS } from '../constants';

interface TaskModalProps {
  task?: Task | null;
  tasks: Task[];
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, tasks, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: TaskStatus.INCOMPLETE,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date().toISOString().split('T')[0],
    parentId: null,
    labels: []
  });

  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    onSave({
      id: task?.id || Math.random().toString(36).substr(2, 9),
      createdAt: task?.createdAt || new Date().toISOString(),
      ...(formData as Task)
    });
    onClose();
  };

  const addLabel = () => {
    if (labelInput && !formData.labels?.includes(labelInput)) {
      setFormData(prev => ({ ...prev, labels: [...(prev.labels || []), labelInput] }));
      setLabelInput('');
    }
  };

  const removeLabel = (label: string) => {
    setFormData(prev => ({ ...prev, labels: prev.labels?.filter(l => l !== label) }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">{task ? 'Edit Task' : 'New Task'}</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                placeholder="Add more details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white outline-none"
                >
                  {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white outline-none"
                >
                  {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Parent Task (Optional)</label>
                <select
                  value={formData.parentId || ''}
                  onChange={e => setFormData({ ...formData, parentId: e.target.value || null })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white outline-none"
                >
                  <option value="">None</option>
                  {tasks.filter(t => t.id !== task?.id).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Labels</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {formData.labels?.map(label => (
                  <span key={label} className="bg-slate-100 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    {label}
                    <button type="button" onClick={() => removeLabel(label)} className="text-slate-400 hover:text-rose-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={labelInput}
                  onChange={e => setLabelInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none"
                  placeholder="Add a label..."
                />
                <button type="button" onClick={addLabel} className="bg-slate-100 px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors">
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
