import { Target, TrendingUp, Shield, Sparkles } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Matching",
      description: "AI-powered job recommendations tailored to your skills and preferences"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fraud Protection",
      description: "Every job listing is verified and fraud-scored for your safety"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Career Growth",
      description: "Track applications and get insights to improve your job search"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Premium Features",
      description: "Unlock unlimited applications and priority recommendations"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sky-600 text-xs font-bold tracking-widest uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-gray-900 mb-4">
            Built for Nepal's Job Market
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Everything you need to find your dream job or hire the perfect candidate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-gray-200 hover:border-sky-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
