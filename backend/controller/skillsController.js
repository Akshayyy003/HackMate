const axios = require('axios');
const User = require('../models/User');


async function fetchFromQuizApi(topic, limit = 10) {
  const API_KEY = process.env.QUIZAPI_KEY;
  if (!API_KEY) throw new Error('QUIZAPI_KEY not configured');

  const base = 'https://quizapi.io/api/v1/questions';
  const params = {
    apiKey: API_KEY,
    limit,
    tags: topic, // QuizAPI tag
  };

  try {
    const resp = await axios.get(base, { params });
    return resp.data;
  } catch (err) {
    throw new Error(`Failed to fetch questions from QuizAPI: ${err?.response?.data || err.message}`);
  }
}

// Transform QuizAPI response to frontend format
function transformQuizApiToQuestions(apiItems) {
  return apiItems.map((item, idx) => {
    const answersObj = item.answers || {};
    const optionsArr = [];
    const keyMap = [];

    for (const key of Object.keys(answersObj)) {
      const val = answersObj[key];
      if (val && val.trim() !== '') {
        keyMap.push(key);
        optionsArr.push(val);
      }
    }

    let correctIndex = -1;
    if (item.correct_answers) {
      for (let i = 0; i < keyMap.length; i++) {
        const k = keyMap[i];
        const correctness = item.correct_answers[`${k}_correct`];
        if (correctness && (correctness === 'true' || correctness === true)) {
          correctIndex = i;
          break;
        }
      }
    }

    if (correctIndex === -1) correctIndex = 0;

    return {
      id: idx + 1,
      question: item.question,
      options: optionsArr,
      correctAnswer: correctIndex,
      skill: item.tags ? item.tags.join(',') : '',
      raw: item,
    };
  });
}

// Generate questions endpoint
exports.generateQuestions = async (req, res, next) => {
  try {
    const { skill, limit } = req.body;
    if (!skill || typeof skill !== 'string') {
      return res.status(400).json({ message: 'skill is required in body' });
    }
    const n = limit && Number(limit) > 0 ? Number(limit) : 10;

    let items = [];
    try {
      items = await fetchFromQuizApi(skill.toLowerCase(), n);
      if (!items || items.length < n) {
        // fallback: fetch random questions
        const resp = await axios.get('https://quizapi.io/api/v1/questions', {
          params: { apiKey: process.env.QUIZAPI_KEY, limit: n }
        });
        items = resp.data;
      }
    } catch (err) {
      return next(err);
    }

    const questions = transformQuizApiToQuestions(items).slice(0, n);
    res.json({ questions });
  } catch (err) {
    next(err);
  }
};

// Submit skill endpoint
exports.submitSkill = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { skill, questions, selectedAnswers, score, totalQuestions } = req.body;
    if (!skill || !questions || typeof score !== 'number' || !Array.isArray(selectedAnswers)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    // Calculate stars and level
    const pct = (score / totalQuestions) * 100;
    let stars = 0;
    if (pct >= 90) stars = 5;
    else if (pct >= 80) stars = 4;
    else if (pct >= 70) stars = 3;
    else if (pct >= 60) stars = 2;
    else if (pct >= 50) stars = 1;

    const levelText = stars >= 4 ? 'Expert' : stars >= 3 ? 'Intermediate' : stars >= 1 ? 'Beginner' : 'Needs Improvement';
    const verified = pct >= 50;

    const skillRecord = {
      id: `${skill.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: skill,
      level: `${stars}★ (${levelText})`,
      verified,
      score,
      totalQuestions,
      stars,
      questions, // store full questions for audit
      createdAt: new Date(),
    };

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update existing skill or add new
    const existingIndex = (user.skills || []).findIndex(s => s.name.toLowerCase() === skill.toLowerCase());
    if (existingIndex >= 0) {
      user.skills[existingIndex] = { ...user.skills[existingIndex].toObject ? user.skills[existingIndex].toObject() : user.skills[existingIndex], ...skillRecord };
    } else {
      user.skills = user.skills || [];
      user.skills.push(skillRecord);
    }

    user.verifiedSkills = user.verifiedSkills || [];
    if (verified && !user.verifiedSkills.includes(skill)) user.verifiedSkills.push(skill);

    await user.save();

    res.json({ message: 'Skill saved', skill: skillRecord, userId: user._id });
  } catch (err) {
    next(err);
  }
};
