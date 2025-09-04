'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  AlertCircle,
  Clock,
  Flag,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  status: 'todo' | 'inprogress' | 'done';
  createdBy: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color: string;
}

const mockTeamMembers = [
  { id: '1', name: 'Alex Chen', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '2', name: 'Sarah Kim', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design landing page mockups',
    description: 'Create wireframes and high-fidelity mockups for the main landing page',
    assigneeId: '2',
    assigneeName: 'Sarah Kim',
    assigneeAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    priority: 'high',
    deadline: '2025-03-20',
    status: 'inprogress',
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Set up backend API',
    description: 'Initialize Node.js server with authentication endpoints',
    assigneeId: '1',
    assigneeName: 'Alex Chen',
    priority: 'high',
    deadline: '2025-03-18',
    status: 'todo',
    createdBy: '1',
  },
  {
    id: '3',
    title: 'Train ML model',
    description: 'Prepare dataset and train the recommendation algorithm',
    assigneeId: '3',
    assigneeName: 'Mike Johnson',
    assigneeAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    priority: 'medium',
    deadline: '2025-03-25',
    status: 'todo',
    createdBy: '1',
  },
  {
    id: '4',
    title: 'User research interviews',
    description: 'Conduct 5 user interviews to validate our assumptions',
    assigneeId: '2',
    assigneeName: 'Sarah Kim',
    assigneeAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    priority: 'medium',
    deadline: '2025-03-22',
    status: 'done',
    createdBy: '1',
  },
];

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', taskIds: ['2', '3'], color: 'border-gray-300' },
  { id: 'inprogress', title: 'In Progress', taskIds: ['1'], color: 'border-blue-300' },
  { id: 'done', title: 'Done', taskIds: ['4'], color: 'border-green-300' },
];

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'medium' as const,
    deadline: '',
  });

  const handleCreateTask = () => {
    const assignee = mockTeamMembers.find(member => member.id === newTask.assigneeId);
    if (!assignee) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      status: 'todo',
      createdBy: user?.id || '1',
    };

    setTasks([...tasks, task]);
    setColumns(prev => prev.map(col => 
      col.id === 'todo' 
        ? { ...col, taskIds: [...col.taskIds, task.id] }
        : col
    ));

    setNewTask({
      title: '',
      description: '',
      assigneeId: '',
      priority: 'medium',
      deadline: '',
    });
    setIsCreateDialogOpen(false);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Update task status
    setTasks(prev => prev.map(task => 
      task.id === draggableId 
        ? { ...task, status: destination.droppableId as Task['status'] }
        : task
    ));

    // Update columns
    const startColumn = columns.find(col => col.id === source.droppableId)!;
    const endColumn = columns.find(col => col.id === destination.droppableId)!;

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      setColumns(prev => prev.map(col => 
        col.id === startColumn.id 
          ? { ...col, taskIds: newTaskIds }
          : col
      ));
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);

      setColumns(prev => prev.map(col => {
        if (col.id === startColumn.id) {
          return { ...col, taskIds: startTaskIds };
        }
        if (col.id === endColumn.id) {
          return { ...col, taskIds: endTaskIds };
        }
        return col;
      }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTasksByColumnId = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return [];
    return column.taskIds.map(taskId => tasks.find(task => task.id === taskId)!).filter(Boolean);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Task Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Organize and track your team's progress
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Describe the task"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select onValueChange={(value) => setNewTask({ ...newTask, assigneeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center space-x-2">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-deadline">Deadline</Label>
                    <Input
                      id="task-deadline"
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} disabled={!newTask.title || !newTask.assigneeId}>
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((column, columnIndex) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + columnIndex * 0.1 }}
                >
                  <Card className={`h-fit border-t-4 ${column.color}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{column.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {getTasksByColumnId(column.id).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[200px] space-y-3 transition-colors ${
                              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <AnimatePresence>
                              {getTasksByColumnId(column.id).map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <motion.div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.2 }}
                                      className={`bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all ${
                                        snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                                      }`}
                                    >
                                      {/* Priority indicator */}
                                      <div className="flex items-start justify-between mb-3">
                                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                        <Badge
                                          variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                                          className="text-xs"
                                        >
                                          {task.priority}
                                        </Badge>
                                      </div>

                                      {/* Task content */}
                                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        {task.title}
                                      </h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                        {task.description}
                                      </p>

                                      {/* Assignee */}
                                      <div className="flex items-center space-x-2 mb-3">
                                        <img
                                          src={task.assigneeAvatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'}
                                          alt={task.assigneeName}
                                          className="w-6 h-6 rounded-full object-cover"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                          {task.assigneeName}
                                        </span>
                                      </div>

                                      {/* Deadline */}
                                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                        {new Date(task.deadline) < new Date() && task.status !== 'done' && (
                                          <Badge variant="destructive" className="text-xs ml-auto">
                                            Overdue
                                          </Badge>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))}
                            </AnimatePresence>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </DragDropContext>
        </motion.div>

        {/* Task Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'text-blue-600' },
            { label: 'Completed', value: getTasksByColumnId('done').length, icon: CheckSquare, color: 'text-green-600' },
            { label: 'In Progress', value: getTasksByColumnId('inprogress').length, icon: Clock, color: 'text-yellow-600' },
            { label: 'Overdue', value: tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'done').length, icon: AlertCircle, color: 'text-red-600' },
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}