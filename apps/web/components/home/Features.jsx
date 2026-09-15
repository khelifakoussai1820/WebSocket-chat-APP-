"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturesDetails = [
  {
    FeatureName: "Real-time Messaging",
    FeatureDescription:
      "Send and receive messages instantly through WebSockets",
  },
  {
    FeatureName: "Connect with people",
    FeatureDescription: "Find accounts and send friend invitations",
  },
  {
    FeatureName: "Rooms & Conversations",
    FeatureDescription: "Chat privately or join rooms with other users",
  },
  {
    FeatureName: "Always Connected",
    FeatureDescription: "Connection status, typing indicators and reconnection",
  },
];

function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".features-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-header",
          start: "top 80%",
        },
      });

      gsap.from(".feature-item", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-list",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="feature"
      className="min-h-screen px-6 py-16 font-poppins sm:px-12 lg:px-20 lg:py-32 xl:px-44"
    >
      <div className="features-header max-auto">
        <h1 className="text-3xl font-semibold text-center tracking-tight sm:text-4xl lg:text-5xl">
          Everything you need for better conversations
        </h1>

        <p className="mt-5 text-base leading-8 text-center text-gray-500 sm:text-lg">
          Gosra gives you all the tools to stay connected, whether it&apos;s
          with your friends, your community or your team.
        </p>
      </div>

      <div className="features-list mt-12 lg:mt-24">
        {FeaturesDetails.map((feature, index) => (
          <Card
            key={index}
            index={index}
            feature={feature.FeatureName}
            desc={feature.FeatureDescription}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;

export function Card({ index, feature, desc }) {
  return (
    <div className="feature-item grid grid-cols-[72px_1fr] gap-4 border-t border-gray-200 py-8 sm:grid-cols-[80px_1fr] sm:gap-8">
      <span className="text-sm text-gray-400">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-12">
        <h2 className="text-xl font-medium tracking-tight sm:text-2xl">{feature}</h2>

        <p className="max-w-md text-gray-500 leading-7">{desc}</p>
      </div>
    </div>
  );
}
