import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BotStatusToggle } from '../components/BotStatusToggle';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deployBot } from '../services/api';

export const BotManagement: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [status, setStatus] = useState({
    online: false,
    dnd: false,
    streaming: false,
    invisible: false
  });
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    if (!token) {
      alert('Please enter a bot token');
      return;
    }

    setLoading(true);
    try {
      const result = await deployBot(token, status);
      alert('Bot deployed successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to deploy bot: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
    >
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Bot Configuration</h1>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <label className="block mb-2">Bot Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              placeholder="Enter your bot token"
            />
          </div>

          <div className="space-y-4 mb-8">
            <BotStatusToggle
              label="Online"
              isActive={status.online}
              onChange={(value) => setStatus({ ...status, online: value })}
            />
            <BotStatusToggle
              label="Do Not Disturb"
              isActive={status.dnd}
              onChange={(value) => setStatus({ ...status, dnd: value })}
            />
            <BotStatusToggle
              label="Streaming"
              isActive={status.streaming}
              onChange={(value) => setStatus({ ...status, streaming: value })}
            />
            <BotStatusToggle
              label="Invisible"
              isActive={status.invisible}
              onChange={(value) => setStatus({ ...status, invisible: value })}
            />
          </div>

          <button
            onClick={handleDeploy}
            disabled={loading}
            className={`w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Deploying...' : 'Deploy Bot'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};