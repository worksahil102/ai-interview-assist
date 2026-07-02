import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FaBriefcase,
  FaChartLine,
  FaFileUpload,
  FaMicrophoneAlt,
  FaUserTie,
} from "react-icons/fa";
import axios from "axios";
import { servrUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const response = await axios.post(
        `${servrUrl}/api/interview/resume`,
        formdata,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setRole(response.data.role || "");
      setExperience(response.data.experience || "");
      setProjects(response.data.projects || []);
      setSkills(response.data.skills || []);
      setResumeText(response.data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${servrUrl}/api/interview/generate-questions`,
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      console.log(response.data);

      if (userData) {
        dispatch(
          setUserData({
            ...userData,
            credits: response.data.creditsLeft,
          }),
        );
      }

      setLoading(false);
      onStart(response.data);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f5f7fb] px-5 py-12 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Start Your
            <span className="text-green-500"> AI Interview</span>
          </h2>

          <p className="text-lg text-gray-500 leading-8 max-w-xl">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills and confidence.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie />,
                text: "choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt />,
                text: "choose Role & Experience",
              },
              {
                icon: <FaChartLine />,
                text: "choose Role & Experience",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                  {item.icon}
                </div>

                <span className="font-medium text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Interview SetUp
          </h2>

          <div className="space-y-6">
            {/* Role */}

            <div className="relative">
              <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                type="text"
                placeholder="Enter role"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            {/* Experience */}

            <div className="relative">
              <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                type="text"
                placeholder="Experience"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            {/* Mode */}

            <select
              className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="Technical">Technical Interview</option>

              <option value="HR">HR Interview</option>
            </select>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-green-50 transition"
              >
                <FaFileUpload className="mx-auto text-4xl text-green-500 mb-4" />

                <input
                  hidden
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                <p className="text-gray-500">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload resume (optional)"}
                </p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-5 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Resume Analysis Result
                </h3>

                {projects.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-800 mb-3">Projects</p>

                    <ul className="space-y-2 list-disc list-inside text-gray-600">
                      {projects.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-800 mb-3">Skills</p>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 rounded-xl bg-black text-white font-semibold text-lg shadow-lg hover:bg-gray-900 transition"
            >
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;
