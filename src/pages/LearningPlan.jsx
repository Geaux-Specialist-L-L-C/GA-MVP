import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const LearningPlan = () => {
  const { currentUser } = useAuth();
  const [learningStyle, setLearningStyle] = useState("");
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const fetchUserProfile = async () => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setLearningStyle(userData.learningStyle || "");
        setGrade(userData.grade || "");
        setSubjects(userData.learningPlan || []);
      }
    } catch (error) {
      setError("Failed to load user profile");
      console.error("Error:", error);
    }
  };

  const generateLearningPlan = async () => {
    if (!learningStyle || !grade) {
      setError("Please complete your profile first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `Create a learning plan for a ${grade} grade student with ${learningStyle} learning style.`
          }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const newPlan = JSON.parse(data.choices[0].message.content);
      
      await saveToFirestore(newPlan);
      setSubjects(newPlan);
    } catch (error) {
      setError("Failed to generate learning plan");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToFirestore = async (plan) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        learningPlan: plan
      });
    } catch (error) {
      throw new Error("Failed to save learning plan");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Personalized Learning Plan</h1>
      
      {error && (
        <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <p>Learning Style: <span className="font-semibold">{learningStyle}</span></p>
          <p>Grade Level: <span className="font-semibold">{grade}</span></p>
        </div>

        <button
          onClick={generateLearningPlan}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Learning Plan"}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">{subject.name}</h3>
              <p className="text-gray-600 mb-2">{subject.description}</p>
              <ul className="list-disc list-inside">
                {subject.activities.map((activity, idx) => (
                  <li key={idx} className="text-gray-700">{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPlan;
