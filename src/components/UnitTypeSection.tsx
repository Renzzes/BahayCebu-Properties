import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Plus, Trash2, ZoomIn, Upload, Home, DollarSign, Ruler, FileText } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { UnitTypeDetail } from '@/types/admin';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

interface UnitTypeSectionProps {
  unitTypes: UnitTypeDetail[];
  onUnitTypesChange: (unitTypes: UnitTypeDetail[]) => void;
  onImageUpload: (file: File) => Promise<string>;
}

type PaymentUpdate = Partial<{
  percentage: number;
  amount: string;
  terms: string;
}>;

type UnitTypeUpdate = string | PaymentUpdate;

export default function UnitTypeSection({ unitTypes, onUnitTypesChange, onImageUpload }: UnitTypeSectionProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const handleZoomImage = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
  };

  const handleAddUnitType = () => {
    const newUnitType: UnitTypeDetail = {
      type: '',
      floorArea: '',
      priceRange: '',
      layoutImage: '',
      reservationFee: '',
      monthlyPayment: {
        percentage: 15,
        amount: '',
        terms: '6 months'
      },
      balancePayment: {
        percentage: 85,
        amount: '',
        terms: 'bank/cash'
      },
      description: ''
    };
    onUnitTypesChange([...unitTypes, newUnitType]);
    setActiveTab(unitTypes.length); // Set active tab to the new unit type
  };

  const handleRemoveUnitType = (index: number) => {
    const updatedUnitTypes = unitTypes.filter((_, i) => i !== index);
    onUnitTypesChange(updatedUnitTypes);
    setActiveTab(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await onImageUpload(file);
        const updatedUnitTypes = [...unitTypes];
        updatedUnitTypes[index] = {
          ...updatedUnitTypes[index],
          layoutImage: imageUrl
        };
        onUnitTypesChange(updatedUnitTypes);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const updateUnitType = (
    index: number,
    field: keyof UnitTypeDetail,
    value: UnitTypeUpdate
  ) => {
    const updatedUnitTypes = [...unitTypes];
    const unitType = { ...updatedUnitTypes[index] };

    if (field === 'monthlyPayment' || field === 'balancePayment') {
      unitType[field] = { ...unitType[field], ...(value as PaymentUpdate) };
    } else {
      unitType[field] = value as string;
    }

    updatedUnitTypes[index] = unitType;
    onUnitTypesChange(updatedUnitTypes);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Unit Types</h3>
        <Button
          onClick={handleAddUnitType}
          className="bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Unit Type
        </Button>
      </div>

      {/* Unit Type Tabs */}
      {unitTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {unitTypes.map((unitType, index) => (
            <Button
              key={index}
              variant={activeTab === index ? "default" : "outline"}
              className={cn(
                "flex items-center gap-2",
                activeTab === index && "bg-bahayCebu-green text-white"
              )}
              onClick={() => setActiveTab(index)}
            >
              <Home className="w-4 h-4" />
              {unitType.type || `Unit Type ${index + 1}`}
            </Button>
          ))}
        </div>
      )}

      {/* Unit Type Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unitTypes.map((unitType, index) => (
          <Card 
            key={index} 
            className={cn(
              "relative transition-all duration-200",
              activeTab === index ? "ring-2 ring-bahayCebu-green" : "hover:shadow-lg"
            )}
            onClick={() => setActiveTab(index)}
          >
            <CardContent className="p-6">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveUnitType(index);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              {/* Preview Image */}
              {unitType.layoutImage ? (
                <div className="relative h-48 mb-4 group cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  handleZoomImage(unitType.layoutImage);
                }}>
                  <img
                    src={unitType.layoutImage}
                    alt={`Floor plan for ${unitType.type}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="h-48 mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
                  <label className="cursor-pointer text-center" onClick={(e) => e.stopPropagation()}>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">Upload floor plan</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                  </label>
                </div>
              )}

              {/* Unit Type Details */}
              <div className="space-y-4">
                <div>
                  <Label>Unit Type Name</Label>
                  <Input
                    value={unitType.type}
                    onChange={(e) => updateUnitType(index, 'type', e.target.value)}
                    placeholder="e.g., Studio Unit"
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Floor Area (SQM)</Label>
                    <Input
                      value={unitType.floorArea}
                      onChange={(e) => updateUnitType(index, 'floorArea', e.target.value)}
                      placeholder="e.g., 22.20"
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <Label>Price Range</Label>
                    <Input
                      value={unitType.priceRange}
                      onChange={(e) => updateUnitType(index, 'priceRange', e.target.value)}
                      placeholder="e.g., ₱4.6M - ₱4.9M"
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div>
                  <Label>Reservation Fee</Label>
                  <Input
                    value={unitType.reservationFee}
                    onChange={(e) => updateUnitType(index, 'reservationFee', e.target.value)}
                    placeholder="e.g., ₱30,000"
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Monthly Payment */}
                <div>
                  <Label>Monthly Payment</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input
                      type="number"
                      value={unitType.monthlyPayment.percentage}
                      onChange={(e) => updateUnitType(index, 'monthlyPayment', { percentage: Number(e.target.value) })}
                      placeholder="15"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      value={unitType.monthlyPayment.amount}
                      onChange={(e) => updateUnitType(index, 'monthlyPayment', { amount: e.target.value })}
                      placeholder="₱103K+"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      value={unitType.monthlyPayment.terms}
                      onChange={(e) => updateUnitType(index, 'monthlyPayment', { terms: e.target.value })}
                      placeholder="6 months"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Balance Payment */}
                <div>
                  <Label>Balance Payment</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input
                      type="number"
                      value={unitType.balancePayment.percentage}
                      onChange={(e) => updateUnitType(index, 'balancePayment', { percentage: Number(e.target.value) })}
                      placeholder="85"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      value={unitType.balancePayment.amount}
                      onChange={(e) => updateUnitType(index, 'balancePayment', { amount: e.target.value })}
                      placeholder="₱4M+"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      value={unitType.balancePayment.terms}
                      onChange={(e) => updateUnitType(index, 'balancePayment', { terms: e.target.value })}
                      placeholder="bank/cash"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={unitType.description}
                    onChange={(e) => updateUnitType(index, 'description', e.target.value)}
                    placeholder="Enter unit description"
                    rows={3}
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ruler className="w-4 h-4" />
                  <span>{unitType.floorArea || 'No area set'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{unitType.priceRange || 'No price set'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative h-[80vh]">
            <img
              src={zoomedImage}
              alt="Zoomed floor plan"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 