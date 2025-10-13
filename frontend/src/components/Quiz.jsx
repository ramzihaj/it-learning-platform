import React, { useState } from 'react';

function Quiz({ quiz, onClose }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionIndex, selected) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: selected }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    setScore((correct / quiz.questions.length) * 100);
    setSubmitted(true);
  };

  if (submitted && score !== null) {
    return (
      <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md">
        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Résultats du Quiz</h4>
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${score >= 60 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {score.toFixed(0)}%
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {Math.round(score / 20)}/5 questions correctes
          </p>
          <div className={`p-3 rounded-lg ${score >= 60 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            <p className={`font-semibold ${score >= 60 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {score >= 60 ? '🎉 Excellent travail !' : '📚 Continuez à étudier !'}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="mt-4 w-full bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md">
      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Quiz IA ({quiz.questions.length} questions)</h4>
      <div className="space-y-6">
        {quiz.questions.map((q, i) => (
          <div key={i} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <p className="font-semibold text-gray-900 dark:text-white mb-3">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt.charAt(0)}
                    onChange={(e) => handleAnswer(i, e.target.value)}
                    className="mr-3 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-3 mt-6">
        <button 
          onClick={handleSubmit} 
          className="flex-1 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 font-semibold"
        >
          Soumettre
        </button>
        <button 
          onClick={onClose} 
          className="flex-1 bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-300 font-semibold"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

export default Quiz;