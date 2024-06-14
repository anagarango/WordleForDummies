"use client";
import { useEffect, useState } from "react";

export default function Dumb() {
  const [answerWord, setAnswerWord] = useState<string>("");

  const fetchWord = async () => {
    try {
      const response = await fetch("/api");
      const data = await response.json();
      setAnswerWord(data.word.toUpperCase());
      console.log(data);
    } catch (error) {
      console.error('Error fetching the word:', error);
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <main className="main">
      <button onClick={() => fetchWord()}>{answerWord}</button>
    </main>
  );
}
