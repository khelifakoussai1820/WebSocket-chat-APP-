"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import PrimaryButtons from "../PrimaryButtons";
import SecondaryButtons from "../SecondaryButtons";

function HeroSection() {
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".message-bubble", {
        y: -18,
        rotation: 2,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.35,
      });

      gsap.to(".envelope", {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".envelope-small", {
        y: -25,
        x: 12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });
    }, visualRef);

    return () => ctx.revert();
  }, []);

return (
    <section className="font-poppins  min-h-screen bg-gray-100 flex items-center overflow-hidden">
      <main className="grid grid-cols-1 items-center gap-12 px-6 py-24 w-full md:grid-cols-2 md:gap-16 sm:px-12 lg:px-20 xl:mx-auto xl:max-w-7xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Talk freely.
          </h1>

          <h2 className="mt-2 text-3xl font-semibold leading-tight text-gray-500 sm:text-4xl lg:text-5xl">
            Connect instantly.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            Gosra is a real-time messaging platform built to bring people
            together through simple text and meaningful conversations.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PrimaryButtons path="/signup" ButtonText="Start Talking Now" />
            <SecondaryButtons path="#feature" ButtonText="Explore More" />
          </div>
        </div>

        <div ref={visualRef} className="relative hidden h-[500px] w-full md:block">
          {/* Conversation bubbles */}

          <div className="message-bubble absolute left-8 top-20 rounded-2xl rounded-bl-sm bg-black px-6 py-4 text-sm text-white shadow-lg">
            Hey 👋
          </div>

          <div className="message-bubble absolute right-8 top-32 rounded-2xl rounded-br-sm bg-gray-100 px-6 py-4 text-sm text-black shadow-md">
            Are you there?
          </div>

          <div className="message-bubble absolute left-20 top-56 rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-6 py-4 text-sm text-black shadow-md">
            Yeah, I&apos;m here!
          </div>

          <div className="message-bubble absolute right-20 bottom-28 rounded-2xl rounded-br-sm bg-black px-6 py-4 text-sm text-white shadow-lg">
            Let&apos;s talk.
          </div>

          <div className="message-bubble absolute left-36 bottom-12 rounded-2xl rounded-bl-sm bg-gray-100 px-5 py-3 text-sm text-gray-700">
            👀
          </div>

          {/* Floating envelopes */}

          <div className="envelope absolute left-1/2 top-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl shadow-lg">
            ✈
          </div>

          <div className="envelope-small absolute right-2 top-12 flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg text-white shadow-lg">
            ✉
          </div>

          <div className="envelope-small absolute bottom-20 left-4 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-lg shadow-md">
            ✉
          </div>

          <div className="envelope-small absolute bottom-4 right-32 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm shadow-md">
            ✈
          </div>
        </div>
      </main>
    </section>
  );
}

export default HeroSection;
