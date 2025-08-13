import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Calculator, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LoanCalculatorProps {
  propertyPrice: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ propertyPrice: initialPropertyPrice }) => {
  const [propertyPrice, setPropertyPrice] = useState(initialPropertyPrice);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const calculateLoan = () => {
    const downPayment = (propertyPrice * downPaymentPercentage) / 100;
    const principalAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPmt = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPmt = monthlyPmt * numberOfPayments;
    const totalInt = totalPmt - principalAmount;

    setPrincipal(principalAmount);
    setMonthlyPayment(monthlyPmt);
    setTotalPayment(totalPmt);
    setTotalInterest(totalInt);
  };

  useEffect(() => {
    calculateLoan();
  }, [propertyPrice, downPaymentPercentage, loanTerm, interestRate]);

  const formatCurrency = (amount: number) => {
    return `₱${Math.round(amount).toLocaleString()}`;
  };

  const getPaymentBreakdown = () => {
    const principalPayment = monthlyPayment - (principal * (interestRate / 100 / 12));
    const interestPayment = monthlyPayment - principalPayment;
    return { principalPayment, interestPayment };
  };

  const { principalPayment, interestPayment } = getPaymentBreakdown();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setPropertyPrice(value);
  };

  const handlePriceBlur = () => {
    setIsEditing(false);
  };

  return (
    <TooltipProvider>
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-bahayCebu-green" />
              <CardTitle className="text-lg font-medium text-gray-700">
                Loan Calculator
              </CardTitle>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Estimate your monthly mortgage payments</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Price Display */}
          <div className="bg-gradient-to-br from-bahayCebu-green/10 to-bahayCebu-green/5 p-4 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Property Price</div>
            <div className="relative">
              {isEditing ? (
                <Input
                  type="number"
                  value={propertyPrice}
                  onChange={handlePriceChange}
                  onBlur={handlePriceBlur}
                  className="text-2xl font-semibold text-bahayCebu-green h-10 bg-transparent border-0 focus:ring-0 p-0"
                  autoFocus
                />
              ) : (
                <div 
                  className="text-2xl font-semibold text-bahayCebu-green cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsEditing(true)}
                >
                  {formatCurrency(propertyPrice)}
                </div>
              )}
            </div>
          </div>

          {/* Down Payment Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Down Payment</label>
                <div className="text-lg font-medium text-bahayCebu-darkGray">
                  {formatCurrency((propertyPrice * downPaymentPercentage) / 100)}
                </div>
              </div>
              <span className="text-2xl font-semibold text-bahayCebu-green">{downPaymentPercentage}%</span>
            </div>
            <Slider
              value={[downPaymentPercentage]}
              onValueChange={(value) => setDownPaymentPercentage(value[0])}
              min={20}
              max={50}
              step={5}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>20%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Loan Term Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">Loan Term</label>
              <span className="text-bahayCebu-darkGray font-medium">{loanTerm} years</span>
            </div>
            <Slider
              value={[loanTerm]}
              onValueChange={(value) => setLoanTerm(value[0])}
              min={5}
              max={30}
              step={5}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 years</span>
              <span>30 years</span>
            </div>
          </div>

          {/* Interest Rate Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">Interest Rate</label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Annual interest rate for your loan</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full"
              step="0.1"
            />
          </div>

          {/* Monthly Payment Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
              <div className="text-3xl font-bold text-bahayCebu-green">
                {formatCurrency(monthlyPayment)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div 
                  className="h-full bg-bahayCebu-green"
                  style={{ 
                    width: `${(principalPayment / monthlyPayment) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Principal: </span>
                  <span className="font-medium">{formatCurrency(principalPayment)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Interest: </span>
                  <span className="font-medium text-red-500">{formatCurrency(interestPayment)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Payment</div>
              <div className="text-lg font-semibold">
                {formatCurrency(totalPayment)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Interest</div>
              <div className="text-lg font-semibold text-red-500">
                {formatCurrency(totalInterest)}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            * This is an estimate. Actual loan terms and rates may vary.
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default LoanCalculator; 