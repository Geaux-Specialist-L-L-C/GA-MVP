import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Send, BookOpen } from 'lucide-react';

interface FormControlProps {
  value: string | number;
  onChange: (value: string | number) => void;
  label: string;
  error?: string;
  className?: string;
}

const GradeLevelSelect: React.FC<FormControlProps> = ({
  value,
  onChange,
  error,
  className
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium">Grade Level</label>
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
    >
      {[...Array(12)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          Grade {i + 1}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const SubjectInput: React.FC<FormControlProps> = ({
  value,
  onChange,
  error,
  className
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium">Subject</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
      placeholder="e.g., Mathematics, Science"
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const DifficultySelect: React.FC<FormControlProps> = ({
  value,
  onChange,
  error,
  className
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium">Difficulty Level</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
    >
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const StandardsInput: React.FC<FormControlProps & { standards: string[] }> = ({
  value,
  onChange,
  standards,
  error,
  className
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium">Educational Standards</label>
    <div className="flex flex-wrap gap-2">
      {standards.map((standard) => (
        <button
          key={standard}
          type="button"
          onClick={() => onChange(standard)}
          className={`px-3 py-1 text-sm rounded-full ${
            value === standard 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {standard}
        </button>
      ))}
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export { GradeLevelSelect, SubjectInput, DifficultySelect, StandardsInput };