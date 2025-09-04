'use client';

import React, { useState } from 'react';
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
  Filter,
  UserPlus,
  MessageSquare,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';

const mockUsers = [
  {
    id: '2',
    name: 'Sarah Kim',
    role: 'UI/UX Designer',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Creative designer with 4 years of experience in user-centered design',
    skills: [
      { name: 'Figma', level: 5, verified: true },
      { name: 'React', level: 3, verified: true },
      { name: 'UI Design', level: 5, verified: true },
    ],
    availability: true,
    location: 'San Francisco, CA',
    timezone: 'PST',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Data Scientist',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'ML engineer passionate about solving real-world problems with AI',
    skills: [
      { name: 'Python', level: 5, verified: true },
      { name: 'TensorFlow', level: 4, verified: true },
      { name: 'Machine Learning', level: 5, verified: false },
    ],
    availability: true,
    location: 'New York, NY',
    timezone: 'EST',
  },
  {
    id: '4',
    name: 'Emma Davis',
    role: 'Frontend Developer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Frontend specialist focused on performance and accessibility',
    skills: [
      { name: 'React', level: 5, verified: true },
      { name: 'TypeScript', level: 4, verified: true },
      { name: 'Next.js', level: 4, verified: false },
    ],
    availability: false,
    location: 'London, UK',
    timezone: 'GMT',
  },
  {
    id: '5',
    name: 'David Wilson',
    role: 'Backend Developer',
    avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Cloud architecture enthusiast with expertise in scalable systems',
    skills: [
      { name: 'Node.js', level: 5, verified: true },
      { name: 'AWS', level: 4, verified: true },
      { name: 'Docker', level: 4, verified: false },
    ],
    availability: true,
    location: 'Austin, TX',
    timezone: 'CST',
  },
  {
    id: '6',
    name: 'Lisa Zhang',
    role: 'Product Manager',
    avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Strategic product leader with experience in B2B SaaS and consumer apps',
    skills: [
      { name: 'Product Strategy', level: 5, verified: true },
      { name: 'User Research', level: 4, verified: true },
      { name: 'Analytics', level: 3, verified: false },
    ],
    availability: true,
    location: 'Seattle, WA',
    timezone: 'PST',
  },
];

const roles = ['All Roles', 'Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Data Scientist', 'Product Manager'];
const availabilityOptions = ['All', 'Available', 'Busy'];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;
    
    const matchesAvailability = selectedAvailability === 'All' ||
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
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
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
                  {/* User Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.role}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${user.availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.availability ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {user.bio}
                  </p>

                  {/* Location & Timezone */}
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
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.slice(0, 3).map((skill) => (
                        <SkillBadge
                          key={skill.name}
                          name={skill.name}
                          level={skill.level}
                          verified={skill.verified}
                          className="text-xs"
                        />
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
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">No teammates found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}