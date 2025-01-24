import Card from "../common/Card";
import "./Features.css";

const Features = () => {
  const features = [
    {
      title: "Personalized Learning",
      description: "Tailored learning paths based on your unique style",
      icon: "🎯"
    },
    {
      title: "Interactive Content",
      description: "Engage with dynamic and interactive learning materials",
      icon: "💡"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics",
      icon: "📊"
    },
    {
      title: "Expert Support",
      description: "Get help from experienced educators",
      icon: "👩‍🏫"
    }
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;