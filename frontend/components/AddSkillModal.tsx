'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onGenerated: (questions: any[], skill: string) => void;
}

export function AddSkillModal({ onClose, onGenerated }: Props) {
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!skillInput.trim()) return setError('Enter a skill name (e.g., React)');
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // adjust according to your auth storage
      const resp = await fetch('http://localhost:5000/api/skills/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ skill: skillInput.trim(), limit: 10 }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.message || 'Failed to generate questions');
      }
      const data = await resp.json();
      onGenerated(data.questions, skillInput.trim());
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Add Skill & Generate Test</CardTitle>
          <button onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skill name</label>
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g., React, NodeJS" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Test'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
