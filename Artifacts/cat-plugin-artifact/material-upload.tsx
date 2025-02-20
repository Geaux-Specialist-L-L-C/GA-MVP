import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, BookOpen, X } from 'lucide-react';
import { declarativeMemory } from '@/services/declarativeMemory';

interface MaterialUploadProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const MaterialUpload: React.FC<MaterialUploadProps> = ({
  onSuccess,
  onError
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    subject: '',
    gradeLevel: 1,
    type: 'lesson' as const,
    tags: [],
    author: '',
    status: 'draft' as const
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-populate title from filename
      setMetadata(prev => ({
        ...prev,
        title: selectedFile.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      await declarativeMemory.storeCurriculumMaterial(file, {
        ...metadata,
        createdAt: new Date()
      });
      
      setFile(null);
      setMetadata({
        title: '',
        subject: '',
        gradeLevel: 1,
        type: 'lesson',
        tags: [],
        author: '',
        status: 'draft'
      });
      
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload material';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Upload Curriculum Material
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">File</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {file ? (
                <div className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.md"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                  >
                    Choose a file
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={metadata.title}
                onChange={e => setMetadata(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                className="border rounded-lg p-2"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input
                type="text"
                