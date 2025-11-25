'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Search,
  UserPlus,
  MapPin,
  Users,
} from 'lucide-react';

interface TeamMember {
  userId: string;
  name: string;
  role: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  members: TeamMember[];
  neededRoles: string[];
  status: string;
  hackathon: string;
}

export default function TeamsJoin() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  const roles = [
    'All Roles',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Data Scientist',
    'Product Manager',
  ];

  const loggedInUserId = typeof window !== 'undefined'
    ? localStorage.getItem('userId')
    : null;

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/teams');
        const result = await res.json();

        if (result.success) {
          setTeams(result.teams);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeams();
  }, []);

  // Join team
  const joinTeam = async (teamId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUserId,
          role: selectedRole !== "All Roles" ? selectedRole : "Member"
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("You joined the team!");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to join team");
    }
  };

  // Filter teams
  const filteredTeams = teams.filter(team => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === 'All Roles' ||
      team.neededRoles.includes(selectedRole);

    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Join a Team</h1>
          <p className="text-gray-600 mt-2">
            Explore hackathon teams looking for new members
          </p>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Teams list */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => {
            const alreadyMember = team.members.some(
              m => m.userId === loggedInUserId
            );

            return (
              <motion.div
                key={team._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <Card className="hover:shadow-md duration-300">
                  <CardContent className="p-5 space-y-4">
                    {/* Title */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{team.name}</h2>
                      <Badge>
                        {team.status === "recruiting" ? "Recruiting" : "Active"}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600">{team.description}</p>

                    <div className="flex gap-2 flex-wrap">
                      {team.neededRoles.map(role => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center text-sm gap-2 text-gray-500">
                      <MapPin size={14} />
                      <span>{team.hackathon}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Members: {team.members.length}
                    </p>

                    {/* Join button */}
                    <Button
                      disabled={alreadyMember}
                      onClick={() => joinTeam(team._id)}
                      className="w-full"
                    >
                      <UserPlus className="mr-2" size={16} />
                      {alreadyMember ? "Joined" : "Join Team"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredTeams.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium">No Teams Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
