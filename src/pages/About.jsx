import { Link } from 'react-router-dom';
import { FaShoppingCart, FaDollarSign, FaUser, FaMoneyBillWave, FaTruck, FaHeadphones, FaShieldAlt, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Tom Cruise',
      role: 'Founder & Chairman',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: '#',
        instagram: '#',
        linkedin: '#'
      }
    },
    {
      id: 2,
      name: 'Emma Watson',
      role: 'Managing Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: '#',
        instagram: '#',
        linkedin: '#'
      }
    },
    {
      id: 3,
      name: 'Will Smith',
      role: 'Product Designer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: '#',
        instagram: '#',
        linkedin: '#'
      }
    }
  ];

  const statistics = [
    {
      id: 1,
      icon: <FaShoppingCart className="text-4xl" />,
      value: '10.5k',
      label: 'Sallers active our site',
      bgColor: 'bg-white'
    },
    {
      id: 2,
      icon: <FaDollarSign className="text-4xl" />,
      value: '33k',
      label: 'Mopnthly Produduct Sale',
      bgColor: 'bg-red-600 text-white'
    },
    {
      id: 3,
      icon: <FaUser className="text-4xl" />,
      value: '45.5k',
      label: 'Customer active in our site',
      bgColor: 'bg-white'
    },
    {
      id: 4,
      icon: <FaMoneyBillWave className="text-4xl" />,
      value: '25k',
      label: 'Anual gross sale in our site',
      bgColor: 'bg-white'
    }
  ];

  const services = [
    {
      id: 1,
      icon: <FaTruck className="text-4xl" />,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140'
    },
    {
      id: 2,
      icon: <FaHeadphones className="text-4xl" />,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support'
    },
    {
      id: 3,
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'MONEY BACK GUARANTEE',
      description: 'We reurn money within 30 days'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Our Story Section */}
      <section className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Welcome to our diecast store! We are passionate about providing collectors and enthusiasts 
                with the finest diecast model cars. Our store features a modern collection management system 
                and an intuitive ordering platform, making it easy for you to find and purchase your favorite 
                diecast models. As an official and trusted store, we were founded with the mission to support 
                and grow the diecast collector community.
              </p>
              <p className="text-lg">
                We offer more than 1 Million products with a diverse assortment in categories ranging from 
                consumer electronics, automotive accessories, collectibles, and much more. Our commitment 
                to quality and customer satisfaction drives everything we do.
              </p>
            </div>
          </div>

          {/* Right Column - Image with Overlay */}
          <div className="relative">
            <div className="relative bg-black rounded-lg overflow-hidden h-96 w-full">
              <img 
                src="/north-scale-logo.png" 
                alt="North Scale Logo - Scale The Streets"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to text if image not found
                  const parent = e.target.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'logo-fallback text-green-500 text-center flex flex-col items-center justify-center h-full';
                    fallback.innerHTML = `
                      <div class="text-6xl md:text-7xl font-bold mb-4" style="font-family: monospace;">NORTH SCALE</div>
                      <div class="text-2xl md:text-3xl font-semibold">Scale The Streets</div>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat) => (
              <div
                key={stat.id}
                className={`${stat.bgColor} rounded-lg p-6 shadow-md text-center transition-transform hover:scale-105`}
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="container-custom py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="text-center">
              <div className="mb-4 relative inline-block">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-64 h-64 object-cover rounded-lg mx-auto shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.role}</p>
              <div className="flex justify-center space-x-4">
                <a
                  href={member.social.twitter}
                  className="text-gray-600 hover:text-blue-400 transition"
                  aria-label={`${member.name} Twitter`}
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  href={member.social.instagram}
                  className="text-gray-600 hover:text-pink-500 transition"
                  aria-label={`${member.name} Instagram`}
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a
                  href={member.social.linkedin}
                  className="text-gray-600 hover:text-blue-600 transition"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full ${dot === 1 ? 'bg-red-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </section>

      {/* Service Guarantees Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4 text-red-600">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

