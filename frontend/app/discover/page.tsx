'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SkillBadge } from '@/components/ui/skill-badge';
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
  MessageSquare,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
  verified: boolean;
}

interface User {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: Skill[];
  availability: boolean;
  location: string;
  timezone: string;
}

const roles = [
  'All Roles',
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'Data Scientist',
  'Product Manager',
];
const availabilityOptions = ['All', 'Available', 'Busy'];

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loggedInUserId = localStorage.getItem('userId'); // get current user
        const res = await fetch(`http://localhost:5000/api/discover?excludeUserId=${loggedInUserId}`);
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;

    const matchesAvailability =
      selectedAvailability === 'All' ||
      (selectedAvailability === 'Available' && user.availability) ||
      (selectedAvailability === 'Busy' && !user.availability);

    return matchesSearch && matchesRole && matchesAvailability;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Discover Teammates
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Find talented developers and designers to join your team
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, role, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Grid */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.role}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${user.availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.availability ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{user.bio}</p>

                  {/* Location and Timezone */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{user.timezone}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.slice(0, 3).map(skill => (
                        <SkillBadge key={skill.id} {...skill} />
                      ))}
                      {user.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />Invite
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Users Found */}
        {filteredUsers.length === 0 && (
          <motion.div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-lg font-medium">No teammates found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
