import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Database, Brain, Shield, LineChart, Book, Code } from 'lucide-react';

const SystemArchitecture = () => {
  const components = [
    {
      title: "Standards Alignment Engine",
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      description: "Vector-based standard mapping (94.7% accuracy)",
      subComponents: ["Semantic Analysis", "Standard Vectors", "Weekly Updates"]
    },
    {
      title: "Ethical Web Scraping",
      icon: <Code className="w-8 h-8 text-green-600" />,
      description: "WCAG 2.1 compliant content harvesting",
      subComponents: ["robots.txt Check", "Rate Limiting", "ADA Compliance"]
    },
    {
      title: "Grade Differentiation",
      icon: <Book className="w-8 h-8 text-purple-600" />,
      description: "Cognitive load optimization by grade",
      subComponents: ["Lexile Scoring", "Visual Support", "Interactive Elements"]
    },
    {
      title: "Compliance System",
      icon: <Shield className="w-8 h-8 text-red-600" />,
      description: "FERPA/COPPA protection with 98% PII reduction",
      subComponents: ["PII Detection", "Bias Checking", "Accessibility Audit"]
    },
    {
      title: "Analytics Dashboard",
      icon: <LineChart className="w-8 h-8 text-orange-600" />,
      description: "Real-time performance monitoring",
      subComponents: ["Quality Metrics", "Teacher Feedback", "Compliance Tracking"]
    }
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">AI Educational Content Generation Architecture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {components.map((component, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-4 mb-2">
                {component.icon}
                <div>
                  <h3 className="font-semibold text-lg">{component.title}</h3>
                  <p className="text-gray-600">{component.description}</p>
                </div>
              </div>
              <div className="ml-12 mt-2">
                <div className="flex gap-2 flex-wrap">
                  {component.subComponents.map((sub, idx) => (
                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemArchitecture;
