'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Crown, Plus, MessageSquare, Settings, Calendar } from 'lucide-react';

interface Member {
  userId: string; // will come from backend as ObjectId string
  name: string;
  role: string;
  avatar?: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  neededRoles: string[];
  leaderId: string;
  status: string;
  hackathon?: string;
}

const AVAILABLE_ROLES = ['Frontend', 'Backend', 'Designer', 'QA', 'Project Manager'];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    hackathon: '',
    leaderRole: '',
    neededRoles: [] as string[],
  });

  const loggedInUserId = localStorage.getItem('userId'); // get user id from localStorage

  // Fetch teams for the logged-in user
  const fetchTeams = async () => {
    if (!loggedInUserId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/teams/${loggedInUserId}`);
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : []); // ensure it's always an array
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [loggedInUserId]);

  const toggleRole = (role: string) => {
    setNewTeam(prev => ({
      ...prev,
      neededRoles: prev.neededRoles.includes(role)
        ? prev.neededRoles.filter(r => r !== role)
        : [...prev.neededRoles, role],
    }));
  };

  const handleCreateTeam = async () => {
    if (!loggedInUserId) return alert('User not logged in!');

    try {
      const teamToSend = {
        name: newTeam.name,
        description: newTeam.description,
        members: [{ userId: loggedInUserId, name: 'You', role: newTeam.leaderRole }],
        neededRoles: newTeam.neededRoles,
        leaderId: loggedInUserId,
        status: 'active',
        hackathon: newTeam.hackathon,
      };

      const res = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamToSend),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(`Error: ${err.message}`);
      }

      const createdTeam = await res.json();
      setTeams(prev => [...prev, createdTeam]);
      setNewTeam({ name: '', description: '', hackathon: '', leaderRole: '', neededRoles: [] });
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Teams</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your teams and collaborate on projects</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Team Name</Label>
                  <Input value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newTeam.description} onChange={e => setNewTeam({ ...newTeam, description: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Hackathon</Label>
                  <Input value={newTeam.hackathon} onChange={e => setNewTeam({ ...newTeam, hackathon: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Your Role (Leader)</Label>
                  <Input value={newTeam.leaderRole} onChange={e => setNewTeam({ ...newTeam, leaderRole: e.target.value })} placeholder="e.g., Team Lead, Frontend Lead" />
                </div>
                <div className="space-y-2">
                  <Label>Needed Roles for Team Members</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_ROLES.map(role => (
                      <Button
                        key={role}
                        size="sm"
                        variant={newTeam.neededRoles.includes(role) ? 'default' : 'outline'}
                        onClick={() => toggleRole(role)}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateTeam}>Create Team</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {teams.map(team => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{team.name}</span>
                        {team.leaderId === loggedInUserId && <Crown className="w-4 h-4 text-yellow-500" />}
                      </CardTitle>
                      <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                        {team.status === 'active' ? 'Active' : 'Recruiting'}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost"><MessageSquare className="w-4 h-4" /></Button>
                      {team.leaderId === loggedInUserId && <Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{team.description}</p>
                  {team.hackathon && (
                    <div className="flex items-center space-x-2 mb-4 text-sm text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span>{team.hackathon}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Members ({team.members.length})</h4>
                    {team.members.map(member => (
                      <div key={member.userId} className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name} {member.userId === team.leaderId && <Crown className="w-3 h-3 text-yellow-500 inline ml-1" />}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
                      </div>
                    ))}
                  </div>

                  {team.neededRoles.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Needed Roles</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {team.neededRoles.map(role => (
                          <Badge key={role}>{role}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" /> Open Team Chat
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
