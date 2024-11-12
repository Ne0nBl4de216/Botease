import React from 'react';
import { Bot, Layout, Settings, Activity, Shield, Users } from 'lucide-react';
import { Widget } from '../components/Widget';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Discord Bot Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your Discord bots with ease
          </p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={item}>
            <Widget
              title="Basic Bot Management"
              icon={<Bot className="w-8 h-8" />}
              onClick={() => navigate('/bot-management')}
              className="hover:bg-sky-900/20 transform hover:-translate-y-1"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <Widget
              title="Hosted Bots"
              icon={<Layout className="w-8 h-8" />}
              className="hover:bg-sky-900/20 transform hover:-translate-y-1"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <Widget
              title="Activity Monitor"
              icon={<Activity className="w-8 h-8" />}
              className="hover:bg-sky-900/20 transform hover:-translate-y-1"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <Widget
              title="Security Settings"
              icon={<Shield className="w-8 h-8" />}
              className="hover:bg-sky-900/20 transform hover:-translate-y-1"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <Widget
              title="User Management"
              icon={<Users className="w-8 h-8" />}
              className="hover:bg-sky-900/20 transform hover:-translate-y-1"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <Widget
              title="Settings"
              icon={<Settings className="w-8 h-8" />}
              className="hover:bg-sky-900/20 transform hover:-translate-y-1"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};