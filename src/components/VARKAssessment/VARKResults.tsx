import React from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface VARKResultsProps {
  results: {
    visual: number;
    auditory: number;
    readWrite: number;
    kinesthetic: number;
    primaryStyle: string;
  };
}

const VARKResults: React.FC<VARKResultsProps> = ({ results }) => {
  const { visual, auditory, readWrite, kinesthetic, primaryStyle } = results;
  
  const data = {
    labels: ['Visual', 'Auditory', 'Read/Write', 'Kinesthetic'],
    datasets: [
      {
        label: 'Your Learning Style',
        data: [visual, auditory, readWrite, kinesthetic],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const getLearningTips = (style: string) => {
    const tips = {
      Visual: [
        'Use diagrams, charts, and mind maps',
        'Watch educational videos and demonstrations',
        'Highlight text in different colors',
        'Create visual summaries of concepts',
      ],
      Auditory: [
        'Record and replay lectures',
        'Participate in group discussions',
        'Use text-to-speech for reading materials',
        'Explain concepts out loud to yourself',
      ],
      'Read/Write': [
        'Take detailed notes during lectures',
        'Rewrite information in your own words',
        'Create lists and summaries',
        'Practice writing explanations',
      ],
      Kinesthetic: [
        'Use hands-on learning activities',
        'Take breaks to move around while studying',
        'Create physical models or diagrams',
        'Use role-playing to understand concepts',
      ],
    }[style] || [];

    return tips;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Your VARK Learning Style Results</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square">
          <Radar data={data} options={options} />
        </div>
        
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              Your Primary Learning Style:
            </h3>
            <div className="text-2xl font-bold text-blue-600">
              {primaryStyle}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Recommended Learning Strategies:
            </h3>
            <ul className="space-y-3">
              {getLearningTips(primaryStyle).map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-blue-600">•</span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VARKResults;