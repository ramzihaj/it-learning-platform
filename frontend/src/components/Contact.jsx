import React, { useState } from 'react';
import axios from 'axios';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Erreur envoi contact:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    {
      icon: <EnvelopeIcon className="h-6 w-6" />,
      title: 'Email',
      value: 'contact@itlearnpro.com',
      description: 'Réponse sous 24h'
    },
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      description: 'Lun-Ven 9h-18h'
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: 'Adresse',
      value: 'Paris, France',
      description: 'Support mondial'
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: 'Horaires',
      value: '24h/24',
      description: 'Support en ligne'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Une question ? Un problème ? Notre équipe est là pour vous aider à réussir votre parcours d'apprentissage IT.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de Contact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Envoyez-nous un message
            </h2>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                <p className="text-red-700 dark:text-red-300 font-medium">
                  Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
                      errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
                      errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
                    errors.subject ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Sujet de votre message"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 resize-none ${
                    errors.message ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Décrivez votre question ou problème en détail..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formData.message.length}/500 caractères
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Informations de Contact */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Informations de contact
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <div className="text-blue-600 dark:text-blue-400">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        {info.value}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Rapide */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Questions fréquentes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Combien de temps pour une réponse ?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Nous répondons généralement dans les 24 heures ouvrées.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Support technique disponible ?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Oui, notre équipe technique est disponible pour vous aider.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Cours personnalisés ?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Nous proposons des formations sur mesure pour les entreprises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
