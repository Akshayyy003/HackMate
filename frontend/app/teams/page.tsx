'use client';

import React, { useState } from 'react';
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
  Users,
  Plus,
  Crown,
  MessageSquare,
  Settings,
  UserPlus,
  Calendar,
} from 'lucide-react';

const mockTeams = [
  {
    id: '1',
    name: 'AI Innovation Squad',
    description: 'Building the next generation of AI-powered applications',
    members: [
      { id: '1', name: 'Alex Chen', role: 'Full Stack Developer', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: '2', name: 'Sarah Kim', role: 'UI/UX Designer', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: '3', name: 'Mike Johnson', role: 'Data Scientist', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100' },
    ],
    leaderId: '1',
    status: 'active',
    hackathon: 'TechCrunch Disrupt 2025',
  },
  {
    id: '2',
    name: 'Green Tech Warriors',
    description: 'Creating sustainable solutions for environmental challenges',
    members: [
      { id: '1', name: 'Alex Chen', role: 'Full Stack Developer', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: '4', name: 'Emma Davis', role: 'Frontend Developer', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
    ],
    leaderId: '1',
    status: 'recruiting',
  },
];

export default function TeamsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    requiredRoles: '',
  });

  const handleCreateTeam = () => {
    // Mock team creation
    setNewTeam({ name: '', description: '', requiredRoles: '' });
    setIsCreateDialogOpen(false);
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
              My Teams
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your teams and collaborate on projects
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="Enter team name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Textarea
                    id="team-description"
                    placeholder="Describe your team's mission and goals"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="required-roles">Required Roles (comma-separated)</Label>
                  <Input
                    id="required-roles"
                    placeholder="e.g., Frontend Developer, UI/UX Designer"
                    value={newTeam.requiredRoles}
                    onChange={(e) => setNewTeam({ ...newTeam, requiredRoles: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTeam}>Create Team</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{team.name}</span>
                        {team.leaderId === '1' && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </CardTitle>
                      <Badge
                        variant={team.status === 'active' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {team.status === 'active' ? 'Active' : 'Recruiting'}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      {team.leaderId === '1' && (
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {team.description}
                  </p>

                  {team.hackathon && (
                    <div className="flex items-center space-x-2 mb-4 text-sm text-blue-600 dark:text-blue-400">
                      <Calendar className="w-4 h-4" />
                      <span>{team.hackathon}</span>
                    </div>
                  )}

                  {/* Team Members */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Members ({team.members.length})
                      </h4>
                      {team.status === 'recruiting' && team.leaderId === '1' && (
                        <Button size="xs" variant="outline">
                          <UserPlus className="w-3 h-3 mr-1" />
                          Invite
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.name}
                              {member.id === team.leaderId && (
                                <Crown className="w-3 h-3 text-yellow-500 inline ml-1" />
                              )}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Team Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}