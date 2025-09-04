'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SkillBadge } from '@/components/ui/skill-badge';
import {
  Trophy,
  Users,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Plus,
  TrendingUp,
} from 'lucide-react';

const quickStats = [
  { icon: CheckCircle2, label: 'Verified Skills', value: '8', color: 'text-green-600' },
  { icon: Users, label: 'Active Teams', value: '2', color: 'text-blue-600' },
  { icon: Calendar, label: 'Upcoming Events', value: '3', color: 'text-purple-600' },
  { icon: Trophy, label: 'Hackathons Won', value: '1', color: 'text-yellow-600' },
];

const recentActivity = [
  { action: 'Verified React skill', time: '2 hours ago', type: 'skill' },
  { action: 'Joined "AI Innovation Team"', time: '1 day ago', type: 'team' },
  { action: 'Registered for TechCrunch Disrupt', time: '3 days ago', type: 'hackathon' },
];

const upcomingHackathons = [
  {
    id: '1',
    name: 'AI Innovation Challenge',
    date: 'March 15-17, 2025',
    participants: 250,
    prize: '$10,000',
  },
  {
    id: '2',
    name: 'Green Tech Hackathon',
    date: 'March 22-24, 2025',
    participants: 180,
    prize: '$5,000',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Ready to build something amazing today?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Your Skills</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill) => (
                    <SkillBadge
                      key={skill.id}
                      name={skill.name}
                      level={skill.level}
                      verified={skill.verified}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Hackathons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Hackathons</span>
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {upcomingHackathons.map((hackathon, index) => (
                  <motion.div
                    key={hackathon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {hackathon.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {hackathon.date}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{hackathon.participants} participants</span>
                      <span className="font-medium text-green-600">
                        Prize: {hackathon.prize}
                      </span>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      Join Hackathon
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <Button className="h-16 flex items-center justify-center space-x-2" variant="outline">
            <Users className="w-5 h-5" />
            <span>Find Teammates</span>
          </Button>
          <Button className="h-16 flex items-center justify-center space-x-2" variant="outline">
            <Plus className="w-5 h-5" />
            <span>Create Team</span>
          </Button>
          <Button className="h-16 flex items-center justify-center space-x-2" variant="outline">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}