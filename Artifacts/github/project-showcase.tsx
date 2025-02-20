import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Building2, Code, MessageSquare, Search } from 'lucide-react';

const ProjectShowcase = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const projects = [
    {
      id: 'enterprise-bot',
      title: 'Enterprise Assistant',
      description: 'AI-powered enterprise solution for large-scale business operations',
      icon: <Building2 className="w-6 h-6" />,
      features: [
        'Multi-department support',
        'Custom workflow integration',
        'Advanced analytics dashboard',
        'Role-based access control'
      ],
      tags: ['Enterprise', 'GPT-4', 'Analytics', 'Workflow'],
      demoUrl: '#',
    },
    {
      id: 'support-bot',
      title: 'Technical Support Bot',
      description: 'Intelligent technical support assistant with code understanding',
      icon: <Code className="w-6 h-6" />,
      features: [
        'Code analysis',
        'Documentation integration',
        'GitHub issue tracking',
        'Automated troubleshooting'
      ],
      tags: ['Development', 'Support', 'Code', 'GitHub'],
      demoUrl: '#',
    },
    {
      id: 'research-bot',
      title: 'Research Assistant',
      description: 'Advanced research and analysis chatbot for academic and business research',
      icon: <Search className="w-6 h-6" />,
      features: [
        'Literature review',
        'Data analysis',
        'Citation management',
        'Research synthesis'
      ],
      tags: ['Research', 'Analysis', 'Academic', 'Data'],
      demoUrl: '#',
    },
    {
      id: 'customer-service',
      title: 'Customer Service Bot',
      description: 'Intelligent customer service automation with natural language understanding',
      icon: <MessageSquare className="w-6 h-6" />,
      features: [
        'Multi-language support',
        'Sentiment analysis',
        'CRM integration',
        'Automated ticket routing'
      ],
      tags: ['Customer Service', 'NLP', 'CRM', 'Support'],
      demoUrl: '#',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our AI Solutions</h1>
        <p className="text-xl text-gray-600">
          Cutting-edge chatbot implementations for enterprise needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {project.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <button 
                onClick={() => setActiveDemo(project.id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                View Demo
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Geaux Specialist?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Brain className="w-8 h-8 text-blue-500" />
                <CardTitle>Advanced AI</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>State-of-the-art language models with custom training for your specific needs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Code className="w-8 h-8 text-blue-500" />
                <CardTitle>Custom Integration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Seamless integration with your existing systems and workflows</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <CardTitle>24/7 Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Round-the-clock technical support and maintenance for your AI solutions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;