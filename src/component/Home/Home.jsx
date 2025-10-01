import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    
    AOS.init({ 
      duration: 1000, 
      once: true,
      offset: 0,
      disable: 'mobile'
    });

    // Cleanup function
    return () => {
      window.history.scrollRestoration = 'auto';
    };
  }, []);

  const handleMouseMove = (e) => {
    const { clientX: mouseX, clientY: mouseY } = e;
    const elements = document.querySelectorAll('.interactive');

    elements.forEach((el) => {
      const speedX = el.getAttribute('data-speed-x') || 0;
      const speedY = el.getAttribute('data-speed-y') || 0;
      const maxMovement = 50;

      const offsetX = ((mouseX / window.innerWidth) - 0.5) * maxMovement * speedX;
      const offsetY = ((mouseY / window.innerHeight) - 0.5) * maxMovement * speedY;

      el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="h-screen text-black font-sans relative" onMouseMove={handleMouseMove}>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-64px)] px-6 md:px-20" data-aos="fade-up">
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          ScoreNinja
        </h1>
        <p className="max-w-2xl text-xl md:text-2xl text-gray-700 mb-8">
          Create, Manage, and Execute Online Tests with Confidence
        </p>
        <button 
          onClick={() => navigate('/auth')} 
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-lg rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        >
          Get Started →
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose TestSprint?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🚀",
              title: "Quick Setup",
              description: "Create and deploy tests in minutes with our intuitive interface"
            },
            {
              icon: "🔒",
              title: "Secure Testing",
              description: "Advanced security features to maintain test integrity"
            },
            {
              icon: "📊",
              title: "Detailed Analytics",
              description: "Get comprehensive insights into test performance"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-gradient-to-r from-blue-50 to-teal-50" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">Join thousands of educators using TestSprint</p>
        <button 
          onClick={() => navigate('/auth')} 
          className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Create Your First Test
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 border-t">
        <p>© {new Date().getFullYear()} ScoreNinja. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;