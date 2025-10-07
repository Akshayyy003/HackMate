'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Star,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Clock,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  skill?: string;
  raw?: any;
}

interface SkillTestProps {
  skill: string;
  questions: Question[]; // provided by backend generate endpoint
  onComplete: (score: number, totalQuestions: number, details: { questions: Question[], selectedAnswers: number[] }) => void;
  onClose: () => void;
}

export function SkillTest({ skill, questions: initialQuestions, onComplete, onClose }: SkillTestProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(initialQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes

  useEffect(() => {
    setQuestions(initialQuestions || []);
    setSelectedAnswers(new Array(initialQuestions.length).fill(-1));
  }, [initialQuestions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getStarRating = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 5;
    if (percentage >= 80) return 4;
    if (percentage >= 70) return 3;
    if (percentage >= 60) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    const stars = getStarRating(score, questions.length);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            </motion.div>
            <CardTitle className="text-2xl">Test Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Score</h3>
              <p className="text-3xl font-bold text-blue-600">{score}/{questions.length}</p>
              <p className="text-gray-600">{Math.round((score / questions.length) * 100)}% Correct</p>
            </div>

            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
                  <Star className={`w-8 h-8 ${index < stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                </motion.div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Performance Level</h4>
              <Badge variant={stars >= 4 ? 'default' : stars >= 3 ? 'secondary' : 'outline'}>
                {stars >= 4 ? 'Expert' : stars >= 3 ? 'Intermediate' : stars >= 1 ? 'Beginner' : 'Needs Improvement'}
              </Badge>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
              <Button
                onClick={async () => {
                  const score = calculateScore();
                  const total = questions.length;
                  const percentage = (score / total) * 100;

                  // Decide skill level based on performance
                  let level = "Beginner";
                  if (percentage >= 90) level = "Expert";
                  else if (percentage >= 70) level = "Intermediate";
                  const userId = localStorage.getItem("userId"); 

                  try {
                    const res = await fetch("http://localhost:5000/api/skills/add", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({userId, skill, level }),
                    });

                    if (res.ok) {
                      alert(`${skill} (${level}) added to your profile!`);
                      onComplete(score, total, { questions, selectedAnswers });
                    } else {
                      const data = await res.json();
                      alert(`Error: ${data.message}`);
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Failed to add skill to profile");
                  }
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Add to Profile
              </Button>

            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <Badge variant="outline">
            {skill} Verification
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{currentQuestion + 1} of {questions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{question.question}</p>

              <div className="grid gap-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-4 text-left border rounded-lg transition-all ${selectedAnswers[currentQuestion] === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAnswers[currentQuestion] === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {selectedAnswers[currentQuestion] === index && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestion] === -1}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmitTest} disabled={selectedAnswers.some(answer => answer === -1)} className="bg-green-600 hover:bg-green-700">
              Submit Test
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded text-sm font-medium transition-all ${index === currentQuestion ? 'bg-blue-600 text-white' : selectedAnswers[index] !== -1 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
