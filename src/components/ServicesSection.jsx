import { FaTruck, FaHeadset, FaShieldAlt } from 'react-icons/fa';

const ServicesSection = () => {
  const services = [
    {
      icon: FaTruck,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140',
    },
    {
      icon: FaHeadset,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
    },
    {
      icon: FaShieldAlt,
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-300 rounded-full mb-4 relative">
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                    <Icon className="text-3xl text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;


