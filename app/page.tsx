"use client";

import React from 'react';
import Feature from '@/components/(Homepage)/Feature';
import Pricing from '@/components/(Homepage)/Pricing';
import Faq from '@/components/(Homepage)/Faq';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SingleURL from '@/components/(Mode)/SingleUrl';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const scrollToShortener = () => {
    const shortenerSection = document.getElementById('shortener-section');
    if (shortenerSection) {
      const offset = 80; // Adjust for fixed header if needed
      const elementPosition = shortenerSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const stats = [
    { label: 'Links Shortened', value: '10M+', description: 'and counting' },
    { label: 'Active Users', value: '50K+', description: 'worldwide' },
    { label: 'Success Rate', value: '99.9%', description: 'uptime' },
    { label: 'Countries', value: '190+', description: 'reached' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white min-h-[80vh] flex items-center">
        {/* Enhanced background with animated patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-600 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                </pattern>
              </defs>
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 animate-pulse" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              {/* Animated feature badge */}
              {/* <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-200/20 mb-6 hover:bg-blue-500/30 transition-colors duration-300">
                <span className="text-sm font-medium">New Feature: Bulk URL Shortening</span>
                <ChevronRight className="w-4 h-4 ml-2 animate-bounce" />
              </div> */}

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block">Transform Your Links.</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent animate-gradient">
                  Share with Confidence.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Create memorable, trackable short links in seconds. Perfect for social media, marketing campaigns, and personal sharing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 text-lg px-8 group"
                  onClick={scrollToShortener}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => router.push('/features')}
                  size="lg"
                  variant={'ghost'}
                  className="border-white text-white hover:bg-white/10 transition-all duration-200 text-lg px-8"
                >
                  View Features
                </Button>
              </div>

              {/* Enhanced stats with animations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                    <div className="text-xs text-blue-200 mt-1">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced wave separator with animation */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="white"
              className="animate-wave"
            />
          </svg>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-24 relative z-20" id="shortener-section">
        <div className="max-w-4xl mx-auto">
          <SingleURL />
        </div>
      </main>

      <Feature />
      <Pricing />
      <Faq />
    </div>
  );
};

export default HomePage;