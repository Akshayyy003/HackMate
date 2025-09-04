'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Search,
  Plus,
  ExternalLink,
} from 'lucide-react';

const mockHackathons = [
  {
    id: '1',
    name: 'TechCrunch Disrupt 2025',
    description: 'The biggest startup competition featuring cutting-edge technology and innovation.',
    date: 'March 15-17, 2025',
    location: 'San Francisco, CA',
    type: 'In-Person',
    participants: 1200,
    teamsRegistered: 300,
    prize: '$100,000',
    status: 'Registration Open',
    tags: ['Startup', 'Innovation', 'AI', 'Web3'],
    organizer: 'TechCrunch',
    image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    name: 'AI Innovation Challenge',
    description: 'Build AI-powered solutions to solve real-world problems.',
    date: 'March 22-24, 2025',
    location: 'Online',
    type: 'Virtual',
    participants: 800,
    teamsRegistered: 200,
    prize: '$50,000',
    status: 'Registration Open',
    tags: ['AI', 'Machine Learning', 'Innovation'],
    organizer: 'AI Institute',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    name: 'Green Tech Hackathon',
    description: 'Create sustainable technology solutions for environmental challenges.',
    date: 'April 5-7, 2025',
    location: 'Austin, TX',
    type: 'Hybrid',
    participants: 600,
    teamsRegistered: 150,
    prize: '$25,000',
    status: 'Coming Soon',
    tags: ['Sustainability', 'CleanTech', 'Environment'],
    organizer: 'EcoTech Alliance',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function HackathonsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHackathons = mockHackathons.filter(hackathon =>
    hackathon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hackathon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              Hackathons
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Discover exciting hackathons and compete with your team
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Hackathon
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search hackathons by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Hackathons Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredHackathons.map((hackathon, index) => (
            <motion.div
              key={hackathon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Header Image */}
                <div className="relative h-48">
                  <img
                    src={hackathon.image}
                    alt={hackathon.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={hackathon.status === 'Registration Open' ? 'default' : 'secondary'}
                    >
                      {hackathon.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90">
                      {hackathon.type}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{hackathon.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        by {hackathon.organizer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{hackathon.prize}</p>
                      <p className="text-xs text-gray-500">Prize Pool</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {hackathon.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{hackathon.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{hackathon.participants} participants, {hackathon.teamsRegistered} teams</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {hackathon.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      className="flex-1"
                      disabled={hackathon.status !== 'Registration Open'}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      {hackathon.status === 'Registration Open' ? 'Join Hackathon' : 'Registration Closed'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredHackathons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">No hackathons found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}