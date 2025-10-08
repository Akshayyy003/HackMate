'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Search,
  Plus,
  ExternalLink,
} from 'lucide-react';

interface Hackathon {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  type: 'In-Person' | 'Virtual' | 'Hybrid';
  participants: number;
  teamsRegistered: number;
  prize: string;
  status: 'Registration Open' | 'Coming Soon' | 'Closed';
  tags: string[];
  organizer: string;
  image?: string;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newHackathon, setNewHackathon] = useState<Omit<Hackathon, '_id' | 'participants' | 'teamsRegistered'>>({
    name: '',
    description: '',
    date: '',
    location: '',
    type: 'In-Person',
    prize: '',
    status: 'Registration Open',
    tags: [],
    organizer: '',
    image: '',
  });

  // Fetch hackathons
  const fetchHackathons = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/hackathons?search=${searchQuery}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch hackathons');
        return res.json();
      })
      .then((data: Hackathon[]) => {
        setHackathons(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Fetch participants for a hackathon
  const fetchParticipants = async (hackathonId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/participants`);
      if (!res.ok) throw new Error('Failed to fetch participants');
      const data = await res.json();
      console.log('Participants:', data);
      alert(`Participants count: ${data.length}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Join a hackathon
  const joinHackathon = async (hackathonId: string) => {
    try {
      const token = localStorage.getItem("token"); // assuming you store JWT in localStorage
  
      const res = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // no body needed if we use req.user._id
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to join hackathon");
      }
  
      const data = await res.json();
      alert(data.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, [searchQuery]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNewChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setNewHackathon({ ...newHackathon, tags: value ? value.split(',').map(tag => tag.trim()) : [] });
    } else {
      setNewHackathon({ ...newHackathon, [name]: value });
    }
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      ...newHackathon,
      description: newHackathon.description || "No description provided.",
      date: newHackathon.date || new Date().toISOString().split("T")[0],
      prize: newHackathon.prize || "No prize announced",
      organizer: newHackathon.organizer || "Unknown Organizer",
    };

    try {
      const res = await fetch('http://localhost:5000/api/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create hackathon');

      setShowCreateModal(false);
      setNewHackathon({
        name: '',
        description: '',
        date: '',
        location: '',
        type: 'In-Person',
        prize: '',
        status: 'Registration Open',
        tags: [],
        organizer: '',
        image: '',
      });

      fetchHackathons();
    } catch (err: any) {
      alert(err.message);
    }
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
              Hackathons
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Discover exciting hackathons and compete with your team
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
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
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Loading/Error */}
        {loading && <div className="text-center py-12 text-gray-500">Loading hackathons...</div>}
        {error && <div className="text-center py-12 text-red-500">{error}</div>}

        {/* Hackathons Grid */}
        {!loading && !error && hackathons.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            {hackathons.map((hackathon, index) => (
              <motion.div
                key={hackathon._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={hackathon.image || 'https://via.placeholder.com/600x400'}
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
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{hackathon.description}</p>
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
                    <div className="flex flex-wrap gap-1">
                      {hackathon.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button
                        className="flex-1"
                        disabled={hackathon.status !== 'Registration Open'}
                        onClick={() => joinHackathon(hackathon._id)}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        {hackathon.status === 'Registration Open' ? 'Join Hackathon' : 'Registration Closed'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchParticipants(hackathon._id)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {(!loading && !error && hackathons.length === 0) && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-600">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-medium">No hackathons found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Create Hackathon Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Create Hackathon</h2>
              <form className="space-y-3" onSubmit={handleCreateSubmit}>
                <Input name="name" placeholder="Name" value={newHackathon.name} onChange={handleNewChange} required />
                <Textarea
                  name="description"
                  placeholder="Description"
                  value={newHackathon.description}
                  onChange={handleNewChange}
                  required
                  className="w-full p-2 border rounded"
                />
                <Input name="organizer" placeholder="Organizer" value={newHackathon.organizer} onChange={handleNewChange} required />
                <Input name="date" type="date" value={newHackathon.date} onChange={handleNewChange} required />
                <Input name="location" placeholder="Location" value={newHackathon.location} onChange={handleNewChange} required />
                <select name="type" value={newHackathon.type} onChange={handleNewChange} className="w-full p-2 border rounded">
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <Input name="prize" placeholder="Prize" value={newHackathon.prize} onChange={handleNewChange} />
                <Input name="status" placeholder="Status" value={newHackathon.status} onChange={handleNewChange} />
                <Input name="tags" placeholder="Tags (comma separated)" value={newHackathon.tags.join(', ')} onChange={handleNewChange} />
                <Input name="image" placeholder="Image URL" value={newHackathon.image} onChange={handleNewChange} />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
