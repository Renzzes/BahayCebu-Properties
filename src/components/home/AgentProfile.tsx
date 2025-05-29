import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAgent } from '@/data/agents';
import type { Agent } from '@/data/agents';

const AgentProfile: React.FC = () => {
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const loadAgent = async () => {
      const agentData = await getAgent();
      setAgent(agentData);
    };
    loadAgent();
  }, []);

  if (!agent) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center text-bahayCebu-darkGray">
            Meet Our Agent
          </h2>
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-bahayCebu-beige/30 to-bahayCebu-green/5 p-8 rounded-2xl border border-bahayCebu-green/10">
              <div className="w-20 h-20 bg-bahayCebu-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-10 w-10 text-bahayCebu-green" />
              </div>
              <h3 className="text-xl font-medium text-bahayCebu-darkGray mb-4">No Agent Available Yet</h3>
              <p className="text-bahayCebu-darkGray/60 mb-6">
                We're in the process of building our team of expert real estate agents. 
                Soon, you'll meet our dedicated professional who will help you find your perfect property in Cebu.
              </p>
              <div className="inline-flex items-center justify-center space-x-2 text-sm text-bahayCebu-green">
                <span>Check back soon</span>
                <span className="w-1.5 h-1.5 rounded-full bg-bahayCebu-green"></span>
                <span>Stay tuned</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center text-bahayCebu-darkGray">
          Meet Our Agent
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <div className="bg-bahayCebu-beige p-1 rounded-lg shadow-sm">
              {agent.image ? (
                <img 
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-auto rounded-lg object-cover aspect-[3/4]"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {agent.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-2 text-bahayCebu-darkGray">{agent.name}</h3>
            <p className="text-bahayCebu-green font-medium mb-4">{agent.title}</p>
            
            <p className="text-gray-600 mb-6">
              {agent.description}
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-bahayCebu-green mr-3" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-bahayCebu-green mr-3" />
                <span>{agent.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-bahayCebu-green mr-3" />
                <span>{agent.location}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-bahayCebu-green hover:bg-bahayCebu-green/90">
                Schedule a Call
              </Button>
              <Button variant="outline" className="border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green/10">
                View All Listings
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-bahayCebu-beige/30 rounded-lg border border-bahayCebu-beige">
              <p className="italic text-gray-600">
                "{agent.description}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentProfile;
