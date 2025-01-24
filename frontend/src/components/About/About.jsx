import React from "react";

const About = () => {
  return (
    <>
      <section id="about" className="pt-24 bg-white min-h-screen">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl text-center md:text-left font-bold text-gray-800 leading-snug">
                Welcome to <span className="text-primary">GlowSmile</span>
              </h2>
              <p className="mt-6 text-gray text-md lg:text-lg">
                We believe every smile tells a story. Our mission is to ensure
                your story is one of confidence, health, and care. From
                preventative dentistry to cutting-edge cosmetic treatments, our
                team is committed to delivering personalized solutions for every
                patient.
              </p>
              <p className="mt-2 text-gray text-md lg:text-lg">
                With a focus on comfort and advanced technology, we aim to make
                every visit as pleasant and effective as possible.
              </p>
            </div>
            <div>
              <div className="relative w-full h-96">
                <img
                  src="/images/about-img.jpg"
                  alt="About us"
                  className="rounded-lg shadow-lg w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary bg-opacity-20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
