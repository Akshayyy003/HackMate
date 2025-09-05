'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { SkillBadge } from '@/components/ui/skill-badge';
import { SkillTest } from '@/components/SkillTest';
import {
  Edit3,
  Save,
  X,
  Plus,
  Github,
  Linkedin,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showSkillTest, setShowSkillTest] = useState(false);
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

  // when test is completed successfully
  const handleTestComplete = (score: number, total: number) => {
    console.log(`✅ Test completed: ${score}/${total}`);
    // TODO: Call backend to save skill & verification
    setShowSkillTest(false);
  };

  // return only test if user clicked "Add"
  if (showSkillTest) {
    return (
      <DashboardLayout>
        <SkillTest
          skill="React"
          onComplete={handleTestComplete}
          onClose={() => setShowSkillTest(false)}
        />
      </DashboardLayout>
    );
  }

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
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Email</Label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {user?.email}
                    </p>
                  </div>

                  <div>
                    <Label>Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.bio || "No bio yet"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>GitHub</Label>
                    {isEditing ? (
                      <Input
                        value={formData.github}
                        onChange={(e) =>
                          setFormData({ ...formData, github: e.target.value })
                        }
                      />
                    ) : (
                      user?.github && (
                        <a
                          href={user.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          {user.github}
                        </a>
                      )
                    )}
                  </div>

                  <div>
                    <Label>LinkedIn</Label>
                    {isEditing ? (
                      <Input
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin: e.target.value })
                        }
                      />
                    ) : (
                      user?.linkedin && (
                        <a
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          {user.linkedin}
                        </a>
                      )
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Available for Collaboration</Label>
                    {isEditing ? (
                      <Switch
                        checked={formData.availability}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, availability: checked })
                        }
                      />
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user?.availability
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {user?.availability ? "Available" : "Not Available"}
                      </span>
                    )}
                  </div>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSkillTest(true)}
                  >
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
