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
          <p className="section-label">Why Choose Us</p>
          <h2 className="section-title">Built for Nepal's Job Market</h2>
          <p className="section-subtitle mx-auto">
            Everything you need to find your dream job or hire the perfect candidate
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="card-hover p-6 text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;