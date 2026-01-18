
import React from 'react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface FlowBoardProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const FlowBoard: React.FC<FlowBoardProps> = ({ tasks, onUpdateStatus }) => {
  const columns: TaskStatus[] = [
    TaskStatus.INCOMPLETE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DUE,
    TaskStatus.COMPLETE
  ];

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {columns.map(status => (
        <div key={status} className="flex-1 min-w-[300px] flex flex-col bg-slate-100/50 rounded-2xl p-4 border border-slate-200">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-slate-700">{status}</h3>
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-500">
              {tasks.filter(t => t.status === status).length}
            </span>
          </div>
          
          <div className="flex-1 space-y-3">
            {tasks.filter(t => t.status === status).map(task => (
              <div 
                key={task.id} 
                draggable
                onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-move hover:shadow-md transition-all active:scale-95"
              >
                <div className={`text-[10px] font-bold uppercase mb-2 ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority} Priority
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">{task.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                <div className="mt-3 flex justify-between items-center">
                   <div className="flex -space-x-1">
                      {task.labels.slice(0, 2).map(l => (
                        <div key={l} title={l} className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-600 border border-white">
                          {l[0].toUpperCase()}
                        </div>
                      ))}
                   </div>
                   <span className="text-[10px] text-slate-400">{task.dueDate}</span>
                </div>
              </div>
            ))}

            {/* Drop Zone */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('taskId');
                onUpdateStatus(id, status);
              }}
              className="h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:border-indigo-300 hover:text-indigo-300 transition-colors"
            >
              <span className="text-xs font-medium">Drop Here</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlowBoard;
