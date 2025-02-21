import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, HelpCircle, Award, Lightbulb, Target, BookOpen, Play, Pause, RotateCcw, CheckCircle, Clock, PenTool, Users, Puzzle, Microphone, Move, ZoomIn, ZoomOut, Trash2, Edit3, Save, Volume2, Square, Maximize2, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

// ... previous imports and constants remain the same ...

const DraggableNode = ({ x, y, text, isSelected, onMove, onSelect, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeText, setNodeText] = useState(text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <g transform={`translate(${x},${y})`}>
      <circle
        r={40}
        fill={isSelected ? '#4f46e5' : '#6366f1'}
        className="cursor-move"
        onMouseDown={(e) => {
          if (!isEditing) {
            onSelect();
            const startX = e.clientX - x;
            const startY = e.clientY - y;
            
            const handleMouseMove = (e) => {
              onMove(e.clientX - startX, e.clientY - startY);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }
        }}
      />
      {isEditing ? (
        <foreignObject x="-35" y="-15" width="70" height="30">
          <input
            ref={inputRef}
            type="text"
            value={nodeText}
            onChange={(e) => setNodeText(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onTextChange(nodeText);
            }}
            className="w-full bg-transparent text-white text-center border-none outline-none"
          />
        </foreignObject>
      ) : (
        <text
          textAnchor="middle"
          dy=".3em"
          fill="white"
          fontSize="12"
          onDoubleClick={() => setIsEditing(true)}
        >
          {text}
        </text>
      )}
    </g>
  );
};

const EnhancedMindMapCanvas = () => {
  const [nodes, setNodes] = useState([{ id: 'center', text: 'My Learning Style', x: 200, y: 150 }]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [connections, setConnections] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 400, height: 300 });
  
  const addNode = (parentId) => {
    const parent = nodes.find(n => n.id === parentId);
    const newId = Date.now().toString();
    const newNode = {
      id: newId,
      text: 'New Concept',
      x: parent.x + Math.random() * 100 - 50,
      y: parent.y + Math.random() * 100 - 50
    };
    setNodes([...nodes, newNode]);
    setConnections([...connections, { from: parentId, to: newId }]);
  };

  const updateNodePosition = (id, x, y) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  };

  const updateNodeText = (id, text) => {
    setNodes(nodes.map(node =>
      node.id === id ? { ...node, text } : node
    ));
  };

  const deleteNode = (id) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(conn => 
      conn.from !== id && conn.to !== id
    ));
    setSelectedNode(null);
  };

  return (
    <div className="border rounded-lg p-4 h-96 relative">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <Button size="sm" onClick={() => setZoom(z => Math.min(z + 0.1, 2))}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        {selectedNode && (
          <Button size="sm" variant="destructive" onClick={() => deleteNode(selectedNode)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        <Button size="sm" onClick={() => selectedNode && addNode(selectedNode)}>
          <PenTool className="w-4 h-4" />
        </Button>
      </div>
      <svg 
        className="w-full h-full"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        style={{ transform: `scale(${zoom})` }}
      >
        <g>
          {connections.map(conn => {
            const from = nodes.find(n => n.id === conn.from);
            const to = nodes.find(n => n.id === conn.to);
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#9333ea"
                strokeWidth="2"
              />
            );
          })}
          {nodes.map(node => (
            <DraggableNode
              key={node.id}
              x={node.x}
              y={node.y}
              text={node.text}
              isSelected={selectedNode === node.id}
              onSelect={() => setSelectedNode(node.id)}
              onMove={(x, y) => updateNodePosition(node.id, x, y)}
              onTextChange={(text) => updateNodeText(node.id, text)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      source.connect(analyzer);
      
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (isRecording) {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        audioChunks.current = [];
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          className="flex items-center gap-2"
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4" /> Stop Recording
            </>
          ) : (
            <>
              <Microphone className="w-4 h-4" /> Start Recording
            </>
          )}
        </Button>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            {Math.floor(recordingTime / 60)}:
            {(recordingTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      
      {isRecording && (
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-100"
              style={{ width: `${(audioLevel / 255) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveLearningGame = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const scenarios = [
    {
      question: "How would you prefer to learn a new dance?",
      options: [
        { text: "Watch a video demonstration", type: "visual" },
        { text: "Listen to the instructor's explanation", type: "auditory" },
        { text: "Try the moves right away", type: "kinesthetic" },
        { text: "Read the step-by-step instructions", type: "reading" }
      ]
    },
    // Add more scenarios...
  ];

  const handleResponse = (type) => {
    setResponses([...responses, type]);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(c => c + 1);
      }
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">{scenarios[currentScenario].question}</h3>
        <div className="grid grid-cols-2 gap-2">
          {scenarios[currentScenario].options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center ${
                showFeedback && responses[responses.length - 1] === option.type
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : ''
              }`}
              onClick={() => handleResponse(option.type)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </div>
      <Progress 
        value={(currentScenario / scenarios.length) * 100}
        className="h-2"
      />
    </div>
  );
};

// ... rest of the component remains the same ...

