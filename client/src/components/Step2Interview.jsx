import React, { use } from "react";
import { Mic } from "lucide-react";
import Timer from "./Timer";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import maleVideo from "../assets/male.mp4";
import femaleVideo from "../assets/female.mp4";
import { Await } from "react-router-dom";
import axios from "axios";
import { servrUrl } from "../App";
import { BsArrowBarRight } from "react-icons/bs";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(false);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  console.log("currentIndex:", currentIndex);
  console.log("questions:", questions);
  console.log("currentQuestion:", currentQuestion);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const englishVoices = voices.filter((v) =>
        v.lang.toLowerCase().startsWith("en"),
      );

      const voice =
        englishVoices.find((v) => v.name.toLowerCase().includes("female")) ||
        englishVoices.find((v) => v.name.toLowerCase().includes("zira")) ||
        englishVoices.find((v) => v.name.toLowerCase().includes("jenny")) ||
        englishVoices[0] ||
        voices[0];

      setSelectedVoice(voice);

      if (
        voice &&
        (voice.name.toLowerCase().includes("guy") ||
          voice.name.toLowerCase().includes("male"))
      ) {
        setVoiceGender("male");
      } else {
        setVoiceGender("female");
      }
    };

    loadVoices();

    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;
  // Example Data

  // const speakText = (text) => {
  //   return new Promise((resolve) => {
  //     if (!window.speechSynthesis) {
  //       resolve();
  //       return;
  //     }

  //     const utterance = new SpeechSynthesisUtterance(text);

  //     if (selectedVoice) {
  //       utterance.voice = selectedVoice;
  //     }

  //     window.speechSynthesis.cancel();

  //     const humanText = text.replace(/,/g, " , ... ".replace(/\./g, ". ... "));

  //     const utterance = new SpeechSynthesisUtterance(humanText);

  //     utterance.voice = selectedVoice;

  //     utterance.rate = 0.92;
  //     utterance.pitch = 1.05;
  //     utterance.volume = 1;

  //     utterance.onstart = () => {
  //       setIsAIPlaying(true);
  //       stoptMic();
  //       videoRef.current?.play();
  //     };

  //     utterance.onend = () => {
  //       videoRef.current?.pause();
  //       videoRef.current.currentTime = 0;
  //       setIsAIPlaying(false);
  //       if (isMicOn) {
  //         startMic();
  //       }

  //       setTimeout(() => {
  //         setSubtitle("");
  //         resolve();
  //       }, 300);
  //     };

  //     setSubtitle(text);

  //     window.speechSynthesis.speak(utterance);
  //   });
  // };
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stoptMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;

        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!window.speechSynthesis) {
      return;
    }

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName} , its great to meet you today . i hope youre feeling confident and ready .`,
        );

        await speakText(
          "i'll ask you a few questions . just answer naturally , and take your time . let's begin",
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright , this one might be a bit more challenging");
        }
        await speakText(currentQuestion?.question);
        if (isMicOn) {
          startMic();
        }
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (isSubmitting) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported on this device.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };
  const stoptMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    // speechSynthesis.resume();

    if (isMicOn) {
      stoptMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;

    stoptMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        `${servrUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion?.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    const nextIndex = currentIndex + 1;

    setCurrentIndex(nextIndex);

    setTimeLeft(questions[nextIndex].timeLimit);

    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stoptMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        `${servrUrl}/api/interview/finish`,
        {
          interviewId,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) {
      return;
    }
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6faf8] flex items-center justify-center p-8">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-12">
          {/* ================= Left Side ================= */}
          <div className="col-span-4 border-r p-5">
            {/* Video Card */}
            <div className="relative rounded-2xl overflow-hidden shadow border">
              <video
                src={videoSource}
                key={videoSource}
                ref={videoRef}
                muted
                playsInline
                autoPlay
                className="w-full h-[220px] object-cover"
              />
            </div>
            {subtitle && (
              <div className="mt-3 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <p className="text-gray-700 text-sm leading-6 text-center">
                  {subtitle}
                </p>
              </div>
            )}

            {/* Interview Status Card */}
            <div className="mt-5 rounded-2xl border shadow-sm p-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Interview Status</span>

                {isAIPlaying && (
                  <span className="text-green-600 text-sm font-semibold">
                    {isAIPlaying ? "AI Speaking ..." : ""}
                  </span>
                )}
              </div>

              <div className="h-px bg-gray-200 my-4"></div>

              <div className="flex justify-center py-4">
                <Timer
                  timeLeft={timeLeft}
                  totalTime={currentQuestion?.timeLimit}
                />
              </div>

              <div className="h-px bg-gray-200 my-4"></div>

              <div className="flex justify-around">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-600">{1}</h2>

                  <p className="text-xs text-gray-500">Current Question</p>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-600">
                    {questions.length}
                  </h2>

                  <p className="text-xs text-gray-500">Total Questions</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= Right Side ================= */}
          <div className="col-span-8 p-6 flex flex-col">
            <h1 className="text-3xl font-bold text-emerald-600 mb-6">
              AI Smart Interview
            </h1>

            {/* Question Card */}
            {!isIntroPhase && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-gray-400 text-xs font-medium">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <h2 className="text-xl font-semibold mt-2">
                  {currentQuestion?.question}
                </h2>
              </div>
            )}

            {/* Answer Box */}
            <div className="relative flex-1 mt-5">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full min-h-[360px] rounded-2xl border border-gray-200 bg-gray-50
p-6
text-gray-700
resize-none
outline-none
focus:border-emerald-400
focus:ring-2
focus:ring-emerald-100
transition
"
              />

              {/* Mic Button */}
              {!feedback ? (
                <div className="mt-6 flex items-center gap-4">
                  {/* Mic */}
                  <button
                    onClick={toggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
      ${
        isMicOn
          ? "bg-black text-white hover:scale-105 "
          : "bg-red-500 text-white hover:scale-105"
      }`}
                  >
                    {isMicOn ? (
                      <FaMicrophone size={20} />
                    ) : (
                      <FaMicrophoneSlash size={20} />
                    )}
                  </button>

                  {/* Submit */}
                  <button
                    onClick={submitAnswer}
                    disabled={isSubmitting}
                    className="flex-1 h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg transition-all duration-300 disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-emerald-700 font-semibold mb-3">
                    AI Feedback
                  </h3>

                  <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                    {feedback}
                  </p>

                  <button
                    onClick={handleNext}
                    className="mt-5 w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    {currentIndex + 1 === questions.length
                      ? "Finish Interview"
                      : "Next Question"}

                    <BsArrowBarRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
