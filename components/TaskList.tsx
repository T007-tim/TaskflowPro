
import React from 'react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS, ICONS } from '../constants';
import { geminiService } from '../services/geminiService';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onAddSubtasks: (parentId: string, subtaskTitles: string[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onEdit, onUpdateStatus, onAddSubtasks }) => {
  const [loadingAI, setLoadingAI] = React.useState<string | null>(null);

  const handleSuggestSubtasks = async (task: Task) => {
    setLoadingAI(task.id);
    const subtasks = await geminiService.suggestSubtasks(task.title, task.description);
    onAddSubtasks(task.id, subtasks);
    setLoadingAI(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <ICONS.TASKS className="w-16 h-16 opacity-20 mb-4" />
        <p className="text-xl font-medium">No tasks found</p>
        <p className="text-sm">Time to plan your next big thing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div key={task.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[task.status]}`}>
                  {task.status}
                </span>
                <span className={`text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority} Priority
                </span>
              </div>
              <h3 className={`font-semibold text-lg text-slate-800 ${task.status === TaskStatus.COMPLETE ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </h3>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2">{task.description}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <span className="text-xs font-medium">Due {task.dueDate}</span>
                </div>
                <div className="flex gap-1">
                  {task.labels.map(label => (
                    <span key={label} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-medium">
                      #{label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleSuggestSubtasks(task)}
                disabled={!!loadingAI}
                className={`p-2 rounded-lg ${loadingAI === task.id ? 'animate-pulse text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'} transition-colors`}
                title="AI Suggest Subtasks"
              >
                <ICONS.SPARKLE className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <ICONS.DELETE className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
