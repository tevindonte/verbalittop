import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Learn from '../components/Learn';
import Cards from '../components/Cards';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Welcome() {
  useEffect(() => {
    // Add chatbot configuration
    const scriptConfig = document.createElement("script");
    scriptConfig.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "igq99n023Iuwzyiy7d3fQ",
        domain: "www.chatbase.co"
      };
    `;
    document.body.appendChild(scriptConfig);

    // Add chatbot embed script
    const scriptEmbed = document.createElement("script");
    scriptEmbed.src = "https://www.chatbase.co/embed.min.js";
    scriptEmbed.setAttribute("chatbotId", "igq99n023Iuwzyiy7d3fQ");
    scriptEmbed.setAttribute("domain", "www.chatbase.co");
    scriptEmbed.defer = true;
    document.body.appendChild(scriptEmbed);

    // Cleanup scripts when component unmounts
    return () => {
      document.body.removeChild(scriptConfig);
      document.body.removeChild(scriptEmbed);
    };
  }, []);

  return (
    <div className="bg-[#080606]">
      <Navbar />
      <Hero />
      <Learn />
      <Cards />
      <Contact />
      <Footer />
    </div>
  );
}
