'use client';

import React, { useState } from 'react';
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
  skill: string;
}

interface SkillTestProps {
  skill: string;
  onComplete: (score: number, totalQuestions: number) => void;
  onClose: () => void;
}

const staticQuestions: Question[] = [
  {
    id: 1,
    question: "What is React primarily used for?",
    options: ["Backend development", "Building user interfaces", "Database management", "Server configuration"],
    correctAnswer: 1,
    skill: "React"
  },
  {
    id: 2,
    question: "Which hook is used to manage state in React functional components?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1,
    skill: "React"
  },
  {
    id: 3,
    question: "What does JSX stand for?",
    options: ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension", "JSON XML"],
    correctAnswer: 0,
    skill: "React"
  },
  {
    id: 4,
    question: "Which method is used to render a React component?",
    options: ["React.render()", "ReactDOM.render()", "Component.render()", "React.display()"],
    correctAnswer: 1,
    skill: "React"
  },
  {
    id: 5,
    question: "What is the virtual DOM in React?",
    options: ["A physical representation of DOM", "A JavaScript representation of the real DOM", "A database for DOM elements", "A styling framework"],
    correctAnswer: 1,
    skill: "React"
  },
  {
    id: 6,
    question: "How do you pass data from parent to child component?",
    options: ["Through state", "Through props", "Through context", "Through refs"],
    correctAnswer: 1,
    skill: "React"
  },
  {
    id: 7,
    question: "What is the purpose of useEffect hook?",
    options: ["To manage state", "To handle side effects", "To create components", "To style components"],
    correctAnswer: 1,
    skill: "React"
  },
  {
    id: 8,
    question: "Which of the following is NOT a React lifecycle method?",
    options: ["componentDidMount", "componentWillUnmount", "componentDidUpdate", "componentWillRender"],
    correctAnswer: 3,
    skill: "React"
  },
  {
    id: 9,
    question: "What is prop drilling in React?",
    options: ["Creating new props", "Passing props through multiple component levels", "Deleting props", "Modifying props"],
    correctAnswer: 1,
    skill: "React"
  },
  {
    id: 10,
    question: "Which operator is commonly used for conditional rendering in JSX?",
    options: ["&&", "||", "??", "++"],
    correctAnswer: 0,
    skill: "React"
  }
];

export function SkillTest({ skill, onComplete, onClose }: SkillTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(staticQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes

  React.useEffect(() => {
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
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < staticQuestions.length - 1) {
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
      if (answer === staticQuestions[index].correctAnswer) {
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
    const stars = getStarRating(score, staticQuestions.length);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            </motion.div>
            <CardTitle className="text-2xl">Test Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Score</h3>
              <p className="text-3xl font-bold text-blue-600">
                {score}/{staticQuestions.length}
              </p>
              <p className="text-gray-600">
                {Math.round((score / staticQuestions.length) * 100)}% Correct
              </p>
            </div>

            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Star
                    className={`w-8 h-8 ${
                      index < stars
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
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
                onClick={() => onComplete(score, staticQuestions.length)} 
                className="flex-1"
              >
                Add to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const progress = ((currentQuestion + 1) / staticQuestions.length) * 100;
  const question = staticQuestions[currentQuestion];

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
            <span className="text-sm text-gray-600">
              {currentQuestion + 1} of {staticQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Question {currentQuestion + 1}
              </CardTitle>
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
                    className={`p-4 text-left border rounded-lg transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
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
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentQuestion < staticQuestions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === -1}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitTest}
              disabled={selectedAnswers.some(answer => answer === -1)}
              className="bg-green-600 hover:bg-green-700"
            >
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
            {staticQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded text-sm font-medium transition-all ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : selectedAnswers[index] !== -1
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
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