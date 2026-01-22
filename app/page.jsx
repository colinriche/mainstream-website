import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette, Menu, X, ChevronDown, ChevronUp, Heart, Target, Users, Smartphone, Car, UsersRound, Mail, Phone, MapPin, ExternalLink, Check } from 'lucide-react';

const MainstreamMovement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('green');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cycle through themes: green -> red -> blue -> green
  const cycleTheme = () => {
    const themeOrder = ['green', 'red', 'blue'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };
  const [expandedProject, setExpandedProject] = useState(null);
  const [donationType, setDonationType] = useState('donate');
  const [selectedProject, setSelectedProject] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    amount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const themes = {
    green: {
      light: 'from-green-50 to-emerald-100',
      dark: 'from-gray-900 to-green-900',
      accent: 'bg-green-600',
      accentHover: 'hover:bg-green-700',
      text: 'text-green-600',
      border: 'border-green-600'
    },
    red: {
      light: 'from-red-50 to-rose-100',
      dark: 'from-gray-900 to-red-900',
      accent: 'bg-red-600',
      accentHover: 'hover:bg-red-700',
      text: 'text-red-600',
      border: 'border-red-600'
    },
    blue: {
      light: 'from-blue-50 to-indigo-100',
      dark: 'from-gray-900 to-blue-900',
      accent: 'bg-blue-600',
      accentHover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      border: 'border-blue-600'
    }
  };

  const projects = [
    {
      id: 1,
      title: "Smart Connect App",
      shortDesc: "A revolutionary mobile application connecting communities with essential services and resources.",
      fullDesc: "Our Smart Connect App leverages cutting-edge technology to bridge the gap between people and services they need. Features include real-time service matching, community forums, resource mapping, and integrated booking systems. The app uses AI to understand user needs and provide personalized recommendations, making access to essential services seamless and efficient.",
      icon: <Smartphone className="w-12 h-12" />,
      status: "In Development"
    },
    {
      id: 2,
      title: "Mobility Solutions",
      shortDesc: "Innovative transportation technology reducing environmental impact and improving accessibility.",
      fullDesc: "This project focuses on developing smart mobility solutions that address urban congestion, reduce carbon emissions, and improve transportation accessibility for all demographics. We're creating an integrated platform that combines ride-sharing, public transport optimization, and electric vehicle infrastructure planning. Our technology uses predictive analytics to optimize routes and reduce wait times.",
      icon: <Car className="w-12 h-12" />,
      status: "Phase 2"
    },
    {
      id: 3,
      title: "Community Hub Network",
      shortDesc: "Building digital and physical spaces that foster social connection and collaborative activities.",
      fullDesc: "The Community Hub Network is designed to combat social isolation and build stronger communities. We're developing both a digital platform and supporting physical infrastructure to enable local sports clubs, interest groups, and social organizations to thrive. Features include event management, member coordination, venue booking, and community funding tools. The system facilitates grassroots organizing and helps groups achieve their goals together.",
      icon: <UsersRound className="w-12 h-12" />,
      status: "Planning"
    }
  ];

  const currentTheme = themes[theme];

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '', amount: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (donationType === 'donate') {
      // Stripe integration would go here
      alert('Stripe payment integration coming soon. Amount: £' + formData.amount);
    } else {
      // Handle pledge submission
      try {
        const response = await fetch('/api/pledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            project: selectedProject
          })
        });

        if (response.ok) {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', phone: '', message: '', amount: '' });
        } else {
          setSubmitStatus('error');
        }
      } catch (error) {
        setSubmitStatus('error');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark' : ''}`}>
      <style jsx>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        button svg {
          transition: transform 0.3s ease;
        }
        .btn-hover {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }
        .btn-hover:active {
          transform: translateY(0px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .btn-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .btn-hover:hover::before {
          left: 100%;
        }
        .btn-secondary-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-secondary-hover:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }
        .btn-secondary-hover:active {
          transform: translateY(0px) scale(1);
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} shadow-lg transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className={`${currentTheme.accent} px-4 py-2 rounded-lg transform hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer active:scale-95 shadow-lg`}>
                <span className="text-white font-bold text-2xl tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  Mm<sup className="text-base">2</sup>
                </span>
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Mainstream Movement
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-all duration-200 hover:scale-110 transform relative group`}>
                <span>About</span>
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${currentTheme.accent} transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button onClick={() => scrollToSection('projects')} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-all duration-200 hover:scale-110 transform relative group`}>
                <span>Projects</span>
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${currentTheme.accent} transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button onClick={() => scrollToSection('support')} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-all duration-200 hover:scale-110 transform relative group`}>
                <span>Support Us</span>
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${currentTheme.accent} transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button onClick={() => scrollToSection('contact')} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-all duration-200 hover:scale-110 transform relative group`}>
                <span>Contact</span>
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${currentTheme.accent} transition-all duration-300 group-hover:w-full`}></span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Theme Cycle Button */}
              <button 
                onClick={cycleTheme}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300 transform hover:scale-110 hover:rotate-180 active:scale-95`}
                title={`Current theme: ${theme}`}
              >
                <Palette className={`w-5 h-5 ${theme === 'green' ? 'text-green-600' : theme === 'red' ? 'text-red-600' : 'text-blue-600'}`} />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300 transform hover:scale-110 active:scale-95`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-200 transform hover:scale-110 active:scale-95`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
            style={{ top: '64px' }} // Start below navbar
          />
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden shadow-2xl border-t backdrop-blur-sm relative z-50" style={{
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.15)' : 'rgba(255, 255, 255, 0.15)',
            borderTopColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.3)'
          }}>
            <div className="px-4 pt-2 pb-4 space-y-2">
              <button onClick={() => scrollToSection('about')} className={`block w-full text-left py-2 px-3 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} rounded transition-all duration-200 hover:translate-x-2 transform ${darkMode ? 'text-white font-semibold' : 'text-gray-900 font-semibold'}`}>About</button>
              <button onClick={() => scrollToSection('projects')} className={`block w-full text-left py-2 px-3 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} rounded transition-all duration-200 hover:translate-x-2 transform ${darkMode ? 'text-white font-semibold' : 'text-gray-900 font-semibold'}`}>Projects</button>
              <button onClick={() => scrollToSection('support')} className={`block w-full text-left py-2 px-3 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} rounded transition-all duration-200 hover:translate-x-2 transform ${darkMode ? 'text-white font-semibold' : 'text-gray-900 font-semibold'}`}>Support Us</button>
              <button onClick={() => scrollToSection('contact')} className={`block w-full text-left py-2 px-3 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} rounded transition-all duration-200 hover:translate-x-2 transform ${darkMode ? 'text-white font-semibold' : 'text-gray-900 font-semibold'}`}>Contact</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={`pt-24 pb-20 bg-gradient-to-br ${darkMode ? currentTheme.dark : currentTheme.light} transition-colors duration-500 relative overflow-hidden`}>
        {/* Under Construction Banner */}
        <div className={`${darkMode ? 'bg-yellow-900/20 border-yellow-600/30' : 'bg-yellow-50 border-yellow-400/50'} border-2 mx-4 sm:mx-8 mt-4 rounded-xl p-4 backdrop-blur-sm animate-pulse-slow`}>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚧</span>
              <span className={`text-lg font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                Website Under Construction
              </span>
              <span className="text-3xl">🚧</span>
            </div>
            <span className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
              We're building something amazing! Check back soon.
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-8">
          <div className="text-center space-y-8 fade-in-section">
            <div className="inline-block animate-float">
              <div className={`${currentTheme.accent} px-8 py-6 rounded-2xl shadow-2xl`} style={{ background: `linear-gradient(135deg, ${darkMode ? '#1f2937' : '#fbbf24'}, ${darkMode ? '#374151' : '#f59e0b'})` }}>
                <span className="text-white font-bold text-6xl md:text-7xl tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif", textShadow: '3px 3px 6px rgba(0,0,0,0.4)' }}>
                  Mm<sup className="text-4xl md:text-5xl">2</sup>
                </span>
              </div>
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
              Mainstream <span className="gradient-text">Movement</span>
            </h1>
            <p className={`text-xl md:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}>
              Research & Development for a Better Tomorrow
            </p>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              We don't just talk about change - we actively create it through innovative tech solutions, strategic campaigns, and community engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button onClick={() => scrollToSection('projects')} className={`btn-hover ${currentTheme.accent} ${currentTheme.accentHover} text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-200`}>
                Explore Projects
              </button>
              <button onClick={() => scrollToSection('support')} className={`btn-secondary-hover ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} px-8 py-4 rounded-lg font-semibold shadow-lg border-2 ${currentTheme.border}`}>
                Support Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Who We Are
            </h2>
            <div className={`w-24 h-1 ${currentTheme.accent} mx-auto mb-6`}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-12 h-12" />,
                title: "Mainstream Appeal",
                desc: "We design solutions for the majority, creating technology that serves everyone, not just a select few."
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "Active Movement",
                desc: "We're proactive changemakers - designing strategies, building apps, running campaigns, and organizing petitions."
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "For-Profit For Good",
                desc: "A sustainable business model focused on social impact, funded by donations and milestone-based pledges."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`fade-in-section p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className={`${currentTheme.accent} w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-white`}>
                  {item.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={`mt-16 p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} fade-in-section`}>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-center max-w-4xl mx-auto`}>
              Since 2014, Mainstream Movement has been at the forefront of developing technology systems that address critical pain points in society. Through rigorous research and development, we create mobile applications, design strategic interventions, and empower communities to drive meaningful change. Our work spans from digital solutions to grassroots campaigns, always with the goal of making life better for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Projects
            </h2>
            <div className={`w-24 h-1 ${currentTheme.accent} mx-auto mb-6`}></div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Innovative solutions addressing real-world challenges through technology and community engagement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className={`fade-in-section ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Project Image */}
                <div className={`h-48 ${currentTheme.accent} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                  <div className="relative z-10 text-white animate-float">
                    {project.icon}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.title}
                    </h3>
                    <span className={`text-xs px-3 py-1 rounded-full ${currentTheme.accent} text-white`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {project.shortDesc}
                  </p>

                  {/* Accordion */}
                  <button
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5`}
                  >
                    <span className={`font-semibold ${currentTheme.text}`}>
                      {expandedProject === project.id ? 'Show Less' : 'Learn More'}
                    </span>
                    {expandedProject === project.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {expandedProject === project.id && (
                    <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} animate-in slide-in-from-top duration-300`}>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {project.fullDesc}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Support Our Work
            </h2>
            <div className={`w-24 h-1 ${currentTheme.accent} mx-auto mb-6`}></div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Help us achieve our goals through donations or pledge support based on project milestones
            </p>
          </div>

          <div className="max-w-2xl mx-auto fade-in-section">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl shadow-xl p-8`}>
              {/* Donation Type Selector */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setDonationType('donate')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    donationType === 'donate'
                      ? `${currentTheme.accent} text-white shadow-lg`
                      : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  Donate Now
                </button>
                <button
                  onClick={() => setDonationType('pledge')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    donationType === 'pledge'
                      ? `${currentTheme.accent} text-white shadow-lg`
                      : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  Make a Pledge
                </button>
              </div>

              {/* Project Selector */}
              <div className="mb-6">
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Support
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className={`w-full p-3 rounded-lg border-2 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:border-${theme}-600 transition-colors`}
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleDonationSubmit} className="space-y-6">
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Amount (£)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    min="1"
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                    placeholder="Your phone number"
                  />
                </div>

                {donationType === 'pledge' && (
                  <div>
                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows="3"
                      className={`w-full p-3 rounded-lg border-2 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:border-${theme}-600 transition-colors`}
                      placeholder="Any specific milestones or notes..."
                    ></textarea>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-hover w-full ${currentTheme.accent} ${currentTheme.accentHover} text-white py-4 rounded-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isSubmitting ? 'Processing...' : donationType === 'donate' ? 'Proceed to Payment' : 'Submit Pledge'}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-4 bg-green-500/20 border-2 border-green-500 rounded-lg text-green-500">
                    <Check className="w-5 h-5" />
                    <span>Thank you for your support!</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border-2 border-red-500 rounded-lg text-red-500">
                    Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Get In Touch
            </h2>
            <div className={`w-24 h-1 ${currentTheme.accent} mx-auto mb-6`}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="fade-in-section space-y-8">
              <div>
                <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Mainstream Movement Ltd
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Registered in England & Wales
                </p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Company Number: 09098347
                </p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Established 2014
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className={`w-6 h-6 ${currentTheme.text} mt-1`} />
                  <div>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Address</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      73 Padstow Avenue<br />
                      Milton Keynes<br />
                      United Kingdom<br />
                      MK6 2ER
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className={`w-6 h-6 ${currentTheme.text} mt-1`} />
                  <div>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Email</p>
                    <a href="mailto:jules@gomainstream.org" className={`${currentTheme.text} hover:underline`}>
                      jules@gomainstream.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ExternalLink className={`w-6 h-6 ${currentTheme.text} mt-1`} />
                  <div>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Website</p>
                    <a href="https://gomainstream.org" className={`${currentTheme.text} hover:underline`}>
                      gomainstream.org
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`fade-in-section ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows="4"
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-${theme}-600 transition-colors`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-hover w-full ${currentTheme.accent} ${currentTheme.accentHover} text-white py-4 rounded-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-4 bg-green-500/20 border-2 border-green-500 rounded-lg text-green-500">
                    <Check className="w-5 h-5" />
                    <span>Message sent successfully!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className={`${currentTheme.accent} p-2 rounded-lg`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Mainstream Movement</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Mainstream Movement Ltd. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Trading as Mainstream Movement | Registered in England & Wales | Company No. 09098347
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainstreamMovement;