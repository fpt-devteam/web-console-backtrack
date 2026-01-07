import { Hero } from '../components/hero';
import { FeatureCard } from '../components/feature-card';
import { Plane, GraduationCap, ShoppingBag, Building2, Train } from 'lucide-react';
import aiImage from '../assets/home/ai.png';
import unifiedArImage from '../assets/home/unified_ar.png';
import efficiencyImage from '../assets/home/efficiency.png';

export function HomePage() {
  const partners = [
    {
      icon: Plane,
      name: 'SkyPort Intl',
    },
    {
      icon: GraduationCap,
      name: 'State Univ',
    },
    {
      icon: ShoppingBag,
      name: 'Metro Mall',
    },
    {
      icon: Building2,
      name: 'ArenaOne',
    },
    {
      icon: Train,
      name: 'TransitCorp',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#E5F4FF] to-white min-h-screen">
      <Hero />
      
      {/* Trusted By Section */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <p className="text-sm font-medium  uppercase tracking-wide">
              TRUSTED BY WORLD-CLASS VENUES & INSTITUTIONS
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {partners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <div
                  key={index}
                  className="flex flex-row items-center gap-3 group"
                >
                  <IconComponent className="w-5 h-5  group-hover: transition-colors" />
                  <span className="text-sm font-medium  group-hover: transition-colors">
                    {partner.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold  mb-4">
              Reimagining the Lost & Found Ecosystem
            </h2>
            <p className="text-lg  max-w-3xl mx-auto">
              Traditional spreadsheets and paper logs create frustration for staff and customers alike. Backtrack Enterprise unifies the entire lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
            <FeatureCard
              image={aiImage}
              title="AI Matching Engine"
              description="Our proprietary engine uses vector embeddings to analyze item descriptions. It proactively suggests matches with ≥80% similarity, connecting 'Lost' reports to 'Found' Inventory instantly."
            />
            <FeatureCard
              image={unifiedArImage}
              title="Unified Architecture"
              description="A seamless multi-tenant environment. Staff can switch between organizational roles and personal reporting views without friction, all within a single secure cloud dashboard."
            />
            <FeatureCard
              image={efficiencyImage}
              title="Operational Efficiency"
              description="Automate the busywork. From auto-generated emails to expiration alerts, reduce operational overhead by up to 60% while drastically improving item recovery rates."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

