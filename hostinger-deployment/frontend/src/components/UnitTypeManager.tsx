import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { UnitTypeDetail, PaymentDetail } from '@/types/admin';
import { Trash2, Upload, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

interface UnitTypeManagerProps {
  unitTypeDetails: UnitTypeDetail[];
  onChange: (details: UnitTypeDetail[]) => void;
  onImageUpload: (file: File) => Promise<string>;
}

const defaultUnitType: UnitTypeDetail = {
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

export default function UnitTypeManager({ unitTypeDetails, onChange, onImageUpload }: UnitTypeManagerProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await onImageUpload(file);
        const updatedDetails = [...unitTypeDetails];
        updatedDetails[index] = {
          ...updatedDetails[index],
          layoutImage: imageUrl
        };
        onChange(updatedDetails);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleZoomImage = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
  };

  const addUnitType = () => {
    onChange([...unitTypeDetails, { ...defaultUnitType }]);
  };

  const removeUnitType = (index: number) => {
    const updatedDetails = unitTypeDetails.filter((_, i) => i !== index);
    onChange(updatedDetails);
  };

  const updateUnitType = (
    index: number,
    field: keyof UnitTypeDetail,
    value: string | PaymentDetail | Partial<PaymentDetail>
  ) => {
    const updatedDetails = [...unitTypeDetails];
    if (field === 'monthlyPayment' || field === 'balancePayment') {
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: {
          ...updatedDetails[index][field],
          ...(value as Partial<PaymentDetail>)
        }
      };
    } else {
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value as string
      };
    }
    onChange(updatedDetails);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Unit Types</h3>
        <Button
          onClick={addUnitType}
          className="bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white"
        >
          Add Unit Type
        </Button>
      </div>

      <div className="grid gap-6">
        {unitTypeDetails.map((detail, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6">
              <button
                onClick={() => removeUnitType(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Unit Type</Label>
                    <Input
                      value={detail.type}
                      onChange={(e) => updateUnitType(index, 'type', e.target.value)}
                      placeholder="e.g., Studio Unit, 1-Bedroom"
                    />
                  </div>

                  <div>
                    <Label>Floor Area (SQM)</Label>
                    <Input
                      value={detail.floorArea}
                      onChange={(e) => updateUnitType(index, 'floorArea', e.target.value)}
                      placeholder="e.g., 22.20"
                    />
                  </div>

                  <div>
                    <Label>Price Range</Label>
                    <Input
                      value={detail.priceRange}
                      onChange={(e) => updateUnitType(index, 'priceRange', e.target.value)}
                      placeholder="e.g., ₱4.6M to ₱4.9M"
                    />
                  </div>

                  <div>
                    <Label>Reservation Fee</Label>
                    <Input
                      value={detail.reservationFee}
                      onChange={(e) => updateUnitType(index, 'reservationFee', e.target.value)}
                      placeholder="e.g., ₱30K"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Monthly Payment</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={detail.monthlyPayment.percentage}
                        onChange={(e) => updateUnitType(index, 'monthlyPayment', { percentage: Number(e.target.value) })}
                        placeholder="15"
                      />
                      <Input
                        value={detail.monthlyPayment.amount}
                        onChange={(e) => updateUnitType(index, 'monthlyPayment', { amount: e.target.value })}
                        placeholder="₱103K+"
                      />
                      <Input
                        value={detail.monthlyPayment.terms}
                        onChange={(e) => updateUnitType(index, 'monthlyPayment', { terms: e.target.value })}
                        placeholder="6 months"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Balance Payment</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={detail.balancePayment.percentage}
                        onChange={(e) => updateUnitType(index, 'balancePayment', { percentage: Number(e.target.value) })}
                        placeholder="85"
                      />
                      <Input
                        value={detail.balancePayment.amount}
                        onChange={(e) => updateUnitType(index, 'balancePayment', { amount: e.target.value })}
                        placeholder="₱4M+"
                      />
                      <Input
                        value={detail.balancePayment.terms}
                        onChange={(e) => updateUnitType(index, 'balancePayment', { terms: e.target.value })}
                        placeholder="bank/cash"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={detail.description}
                      onChange={(e) => updateUnitType(index, 'description', e.target.value)}
                      placeholder="Enter unit description"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <Label>Floor Plan Image</Label>
                  {detail.layoutImage ? (
                    <div className="relative mt-2">
                      <div className="relative h-[200px] w-full">
                        <img
                          src={detail.layoutImage}
                          alt={`Floor plan for ${detail.type}`}
                          className="object-contain w-full h-full cursor-pointer"
                          onClick={() => handleZoomImage(detail.layoutImage)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleZoomImage(detail.layoutImage)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <label className="cursor-pointer text-center">
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">Floor Plan Image</DialogTitle>
          <div className="relative h-[80vh]">
            <img
              src={zoomedImage}
              alt="Zoomed floor plan"
              className="object-contain w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 