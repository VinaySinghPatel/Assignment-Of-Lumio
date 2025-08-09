import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, ArrowLeft, Edit3, Check, Loader2 } from 'lucide-react';
import axios from 'axios';

const EmailEditor = () => {
  const [emailData, setEmailData] = useState(null);
  const [subject, setSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [recipients, setRecipients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('emailData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setEmailData(data);
      setSubject(data.subject || 'Generated Email');
      setEmailContent(data.generatedEmail || '');
      setRecipients(data.recipients || '');
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!recipients.trim() || !subject.trim() || !emailContent.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://lumiopartners-backend.onrender.com/api/send-email', {
        to: recipients,
        subject: subject,
        text: emailContent
      });

      if (response.data) {
        setSuccess('Email sent successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to send email. Please try again.');
      console.error('Error sending email:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!emailData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Generator
            </button>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Edit & Send Email</h1>
            </div>
          </div>

          {/* Email Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSendEmail} className="space-y-6">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To:
                </label>
                <input
                  type="text"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter recipient email addresses"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email subject"
                  required
                />
              </div>

              {/* Email Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Edit3 className="inline w-4 h-4 mr-2" />
                  Email Content:
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
                  placeholder="Edit your email content here..."
                  required
                />
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 text-sm flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    {success}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preview</h3>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">To:</span>
                <span className="ml-2 text-gray-900">{recipients}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Subject:</span>
                <span className="ml-2 text-gray-900">{subject}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <span className="text-sm font-medium text-gray-600 block mb-2">Content:</span>
                <div className="bg-white p-4 rounded border text-gray-900 whitespace-pre-wrap">
                  {emailContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailEditor; 