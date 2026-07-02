import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import AuthModel from "../components/AuthModel";
import { useNavigate } from "react-router-dom";
import { BsClock, BsMic, BsRobot } from "react-icons/bs";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const interviewSteps = [
    {
      icon: <BsRobot size={24} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "AI adjusts difficulty based on selected job role.",
      rotate: "rotate-[-4deg]",
    },
    {
      icon: <BsMic size={24} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers.",
      rotate: "rotate-[3deg] md:-mt-6 shadow-xl",
    },
    {
      icon: <BsClock size={24} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Real interview pressure with time tracking.",
      rotate: "rotate-[-3deg]",
    },
  ];
  return (
    <div className="min-h-screen bg-[#f5f5f5] overflow-x-hidden">
      <Navbar />

      {/* Background Blur */}

      <div className="flex-1 px-6 py-20">
        <motion.div className=" flex flex-col items-center text-center">
          {/* Badge */}

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <HiSparkles size={16} className="text-green-600" />

            <span>AI Powered Smart Interview Platform</span>
          </div>

          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=" text-4xl md:text-6xl font-semibold text-gray-900 leading-tight max-w-4xl"
          >
            Practice Interviews with
            <br />
            <span className=" px-5 py-1  bg-green-100 text-green-600">
              AI Intelligence
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-6 max-w-2xl text-gray-500 text-lg mx-auto"
          >
            Role-based mock interviews with smart follow-ups, adaptive
            difficulty and real-time performance evaluation.
          </motion.p>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/interview");
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className="bg-black text-white px-10 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg"
            >
              Start Interview
              <HiArrowRight />
            </motion.button>

            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/history");
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className="bg-white border border-gray-300 px-10 py-3 rounded-full font-medium hover:border-black transition"
            >
              View History
            </motion.button>
          </div>
        </motion.div>
        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        <motion.div className="mt-24 ">
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
            {interviewSteps.map((item, index) => (
              <motion.div
                key={index}
                className={`relative bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-green-500 px-8 py-10 pt-14 text-center ${item.rotate}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
              >
                {/* Floating Icon */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white border-2 border-green-500 shadow-md flex items-center justify-center ">
                  {item.icon}
                </div>

                {/* Step */}
                <p className="text-[12px] font-semibold tracking-[3px] text-green-500 uppercase">
                  {item.step}
                </p>

                {/* Title */}
                <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-gray-500 leading-7 text-[15px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl font-semibold text-center "
          >
            Advanced AI <span className="text-green-500">Capability</span>
          </motion.h2>
        </div>
      </div>
    </div>
  );
}

export default Home;
