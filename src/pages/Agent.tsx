import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, UserPlus, Star, Award, Home, Briefcase, TrendingUp, Users } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { getAllAgentsPublic } from '@/data/agents';
import type { Agent } from '@/data/agents';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const AgentPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentData = await getAllAgentsPublic();
        setAgents(agentData);
      } catch (error) {
        console.error('Error loading agents:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAgents();
  }, []);

  const renderStatCard = (icon: React.ReactNode, value: string | number, label: string, color: string) => (
    <div className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold mb-1">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
        <div className={`w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center ${color.replace('border', 'bg')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bahayCebu-beige flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bahayCebu-green"></div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="min-h-screen bg-bahayCebu-beige py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-bahayCebu-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-10 w-10 text-bahayCebu-green" />
              </div>
              <h3 className="text-xl font-medium text-bahayCebu-darkGray mb-4">No Agents Available Yet</h3>
              <p className="text-bahayCebu-darkGray/60 mb-6">
                We're in the process of building our team of expert real estate agents. 
                Soon, you'll meet our dedicated professionals who will help you find your perfect property in Cebu.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-serif font-bold text-bahayCebu-darkGray text-center">
            Our Real Estate Agents
          </h1>
          <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
            Meet our team of professional agents dedicated to helping you find your perfect property in Cebu
          </p>
        </div>
      </div>

      {/* Agents List */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {agents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden bg-white">
              <div className="flex flex-col lg:flex-row">
                {/* Left Column - Image */}
                <div className="w-full lg:w-80 bg-gray-100">
                  <div className="relative h-full min-h-[320px]">
                    {agent.image ? (
                      <img 
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold text-lg">{agent.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Agent Information */}
                <div className="flex-1 p-6 lg:p-8">
                  {/* Header Section */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-3xl font-serif font-bold text-bahayCebu-darkGray mb-1">
                          {agent.name}
                        </h2>
                        <p className="text-lg text-bahayCebu-green font-medium">{agent.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">{agent.description}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {renderStatCard(
                      <Home className="h-6 w-6 text-blue-600" />,
                      agent.listings,
                      'Listed Properties',
                      'border-blue-600'
                    )}
                    {renderStatCard(
                      <TrendingUp className="h-6 w-6 text-green-600" />,
                      agent.deals,
                      'Closed Deals',
                      'border-green-600'
                    )}
                    {renderStatCard(
                      <Users className="h-6 w-6 text-purple-600" />,
                      '13+ Years',
                      'Experience',
                      'border-purple-600'
                    )}
                  </div>

                  {/* Specializations */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-bahayCebu-darkGray mb-3">Expertise & Specializations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {agent.specializations.map((spec) => (
                        <div key={spec} className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="h-4 w-4 text-bahayCebu-green" />
                          <span className="text-sm">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a 
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 hover:text-bahayCebu-green transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-bahayCebu-green" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{agent.phone}</p>
                      </div>
                    </a>
                    <a 
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 hover:text-bahayCebu-green transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-bahayCebu-green" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{agent.email}</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-bahayCebu-green" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{agent.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  {(agent.socialMedia?.facebook || agent.socialMedia?.instagram || agent.socialMedia?.linkedin) && (
                    <>
                      <Separator className="my-6" />
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Connect on Social:</span>
                        <div className="flex gap-4">
                          {agent.socialMedia?.facebook && (
                            <a 
                              href={agent.socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-all duration-300 transform hover:scale-110"
                              title="Facebook Profile"
                            >
                              <FaFacebookF className="h-5 w-5 text-[#1877F2] group-hover:text-[#1877F2]" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Visit Facebook Profile
                              </span>
                            </a>
                          )}
                          {agent.socialMedia?.instagram && (
                            <a 
                              href={agent.socialMedia.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 hover:from-[#F58529]/20 hover:via-[#DD2A7B]/20 hover:to-[#8134AF]/20 transition-all duration-300 transform hover:scale-110"
                              title="Instagram Profile"
                            >
                              <FaInstagram className="h-5 w-5 text-[#DD2A7B] group-hover:text-[#DD2A7B]" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Visit Instagram Profile
                              </span>
                            </a>
                          )}
                          {agent.socialMedia?.linkedin && (
                            <a 
                              href={agent.socialMedia.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 transition-all duration-300 transform hover:scale-110"
                              title="LinkedIn Profile"
                            >
                              <FaLinkedinIn className="h-5 w-5 text-[#0A66C2] group-hover:text-[#0A66C2]" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Visit LinkedIn Profile
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
