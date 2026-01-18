
import React from 'react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface HierarchyViewProps {
  tasks: Task[];
}

const HierarchyView: React.FC<HierarchyViewProps> = ({ tasks }) => {
  const rootTasks = tasks.filter(t => !t.parentId);

  const renderTask = (task: Task, depth: number = 0) => {
    const subtasks = tasks.filter(t => t.parentId === task.id);
    
    return (
      <div key={task.id} className="space-y-2">
        <div 
          style={{ marginLeft: `${depth * 24}px` }}
          className={`flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative transition-all hover:border-indigo-300 ${depth > 0 ? 'before:content-[""] before:absolute before:-left-4 before:top-1/2 before:w-4 before:h-px before:bg-slate-300' : ''}`}
        >
          <div className={`w-2 h-2 rounded-full ${task.status === TaskStatus.COMPLETE ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 text-sm">{task.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[task.status]}`}>
                {task.status}
              </span>
              <span className="text-[10px] text-slate-400">{task.dueDate}</span>
            </div>
          </div>
          {subtasks.length > 0 && (
            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {subtasks.length} Subtasks
            </span>
          )}
        </div>
        {subtasks.map(sub => renderTask(sub, depth + 1))}
      </div>
    );
  };

  if (rootTasks.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <p className="text-lg font-medium">No top-level tasks to display hierarchy.</p>
        </div>
     )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {rootTasks.map(task => renderTask(task))}
    </div>
  );
};

export default HierarchyView;
