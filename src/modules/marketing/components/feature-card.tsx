interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

export function FeatureCard({ image, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
      {/* Image Section */}
      <div className="w-full h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-8">
        <h3 className="text-xl font-bold  mb-4">
          {title}
        </h3>
        <p className=" leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

