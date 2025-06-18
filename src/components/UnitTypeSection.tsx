import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Plus, Trash2, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { UnitTypeDetail } from '@/types/admin';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
  };

  const handleRemoveUnitType = (index: number) => {
    const updatedUnitTypes = unitTypes.filter((_, i) => i !== index);
    onUnitTypesChange(updatedUnitTypes);
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

      <div className="grid grid-cols-1 gap-6">
        {unitTypes.map((unitType, index) => (
          <Card key={index} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleRemoveUnitType(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Unit Type Name and Floor Area */}
                  <div className="space-y-4">
                    <div>
                      <Label>Unit Type Name</Label>
                      <Input
                        value={unitType.type}
                        onChange={(e) => updateUnitType(index, 'type', e.target.value)}
                        placeholder="e.g., ARC TOWERS STUDIO UNIT"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Floor Area (SQM)</Label>
                      <Input
                        value={unitType.floorArea}
                        onChange={(e) => updateUnitType(index, 'floorArea', e.target.value)}
                        placeholder="e.g., 22.20"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label>Price Range</Label>
                    <Input
                      value={unitType.priceRange}
                      onChange={(e) => updateUnitType(index, 'priceRange', e.target.value)}
                      placeholder="e.g., ₱4.6M to ₱4.9M"
                      className="mt-1"
                    />
                  </div>

                  {/* Reservation Fee */}
                  <div>
                    <Label>Reservation Fee</Label>
                    <Input
                      value={unitType.reservationFee}
                      onChange={(e) => updateUnitType(index, 'reservationFee', e.target.value)}
                      placeholder="e.g., ₱30K"
                      className="mt-1"
                    />
                  </div>

                  {/* Monthly Payment */}
                  <div className="space-y-2">
                    <Label>Monthly Payment</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Input
                          type="number"
                          value={unitType.monthlyPayment.percentage}
                          onChange={(e) => updateUnitType(index, 'monthlyPayment', { percentage: Number(e.target.value) })}
                          placeholder="15"
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">Percentage</span>
                      </div>
                      <div>
                        <Input
                          value={unitType.monthlyPayment.amount}
                          onChange={(e) => updateUnitType(index, 'monthlyPayment', { amount: e.target.value })}
                          placeholder="₱103K+"
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">Amount</span>
                      </div>
                      <div>
                        <Input
                          value={unitType.monthlyPayment.terms}
                          onChange={(e) => updateUnitType(index, 'monthlyPayment', { terms: e.target.value })}
                          placeholder="6 months"
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">Terms</span>
                      </div>
                    </div>
                  </div>

                  {/* Balance Payment */}
                  <div className="space-y-2">
                    <Label>Balance Payment</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Input
                          type="number"
                          value={unitType.balancePayment.percentage}
                          onChange={(e) => updateUnitType(index, 'balancePayment', { percentage: Number(e.target.value) })}
                          placeholder="85"
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">Percentage</span>
                      </div>
                      <div>
                        <Input
                          value={unitType.balancePayment.amount}
                          onChange={(e) => updateUnitType(index, 'balancePayment', { amount: e.target.value })}
                          placeholder="₱4M+"
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">Amount</span>
                      </div>
                      <div>
                        <Input
                          value={unitType.balancePayment.terms}
                          onChange={(e) => updateUnitType(index, 'balancePayment', { terms: e.target.value })}
                          placeholder="bank/cash"
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">Terms</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floor Plan Image */}
                <div className="space-y-4">
                  <Label>Floor Plan Image</Label>
                  {unitType.layoutImage ? (
                    <div className="relative mt-2">
                      <div className="relative h-[300px] w-full">
                        <img
                          src={unitType.layoutImage}
                          alt={`${unitType.type} layout`}
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={() => handleZoomImage(unitType.layoutImage)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleZoomImage(unitType.layoutImage)}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="block mt-2 h-[300px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      <div className="flex flex-col items-center justify-center h-full">
                        <Plus className="w-8 h-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Upload floor plan</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Preview Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-base">{unitType.type} ({unitType.floorArea} SQM)</p>
                  <p className="text-bahayCebu-blue">Price range - {unitType.priceRange}</p>
                  <p>Reservation Fee: {unitType.reservationFee}</p>
                  <p>{unitType.monthlyPayment.percentage}% Monthly: {unitType.monthlyPayment.amount} ({unitType.monthlyPayment.terms})</p>
                  <p>{unitType.balancePayment.percentage}% Balance: {unitType.balancePayment.amount} ({unitType.balancePayment.terms})</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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