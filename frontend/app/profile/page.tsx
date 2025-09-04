'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { SkillBadge } from '@/components/ui/skill-badge';
import {
  User,
  Mail,
  Github,
  Linkedin,
  Plus,
  Edit3,
  Save,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    availability: user?.availability || false,
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      availability: user?.availability || false,
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {user?.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{user?.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${user?.availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {user?.availability ? 'Available for projects' : 'Not available'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 text-gray-900 dark:text-white">{user?.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 text-gray-900 dark:text-white">{user?.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="py-2 text-gray-600 dark:text-gray-300">
                      {user?.bio || 'No bio available'}
                    </p>
                  )}
                </div>

                {/* Social Links */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    {isEditing ? (
                      <div className="relative">
                        <Github className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="github"
                          placeholder="https://github.com/username"
                          value={formData.github}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <p className="py-2 text-blue-600 dark:text-blue-400 hover:underline">
                        {user?.github || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    {isEditing ? (
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="linkedin"
                          placeholder="https://linkedin.com/in/username"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <p className="py-2 text-blue-600 dark:text-blue-400 hover:underline">
                        {user?.linkedin || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="availability" className="text-base">
                    Available for projects
                  </Label>
                  <Switch
                    id="availability"
                    checked={isEditing ? formData.availability : user?.availability}
                    onCheckedChange={(checked) => 
                      isEditing && setFormData({ ...formData, availability: checked })
                    }
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Skills & Verification
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user?.skills?.map((skill) => (
                    <motion.div
                      key={skill.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <SkillBadge
                        name={skill.name}
                        level={skill.level}
                        verified={skill.verified}
                        className="mb-2"
                      />
                      {!skill.verified && (
                        <Button size="xs" variant="outline" className="w-full">
                          Take Verification Test
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}