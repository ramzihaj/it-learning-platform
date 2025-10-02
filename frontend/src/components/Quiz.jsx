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
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h4 className="font-bold mb-2">Résultats du Quiz</h4>
        <p className={`text-lg font-semibold ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
          Score : {score.toFixed(0)}% ({Math.round(score / 20)}/5 correctes)
        </p>
        <button onClick={onClose} className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded">
      <h4 className="font-bold mb-4">Quiz IA ({quiz.questions.length} questions)</h4>
      {quiz.questions.map((q, i) => (
        <div key={i} className="mb-6 p-3 border rounded">
          <p className="font-semibold mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex) => (
              <label key={optIndex} className="flex items-center">
                <input
                  type="radio"
                  name={`q${i}`}
                  value={opt.charAt(0)}
                  onChange={(e) => handleAnswer(i, e.target.value)}
                  className="mr-2"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex space-x-2">
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Soumettre
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Fermer
        </button>
      </div>
    </div>
  );
}

export default Quiz;