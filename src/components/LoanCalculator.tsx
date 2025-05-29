import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LoanCalculatorProps {
  propertyPrice: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ propertyPrice }) => {
  const [downPayment, setDownPayment] = useState(20); // Default 20% down payment
  const [loanTerm, setLoanTerm] = useState(20); // Default 20 years
  const [interestRate, setInterestRate] = useState(6.5); // Default 6.5% interest rate
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const calculateLoan = () => {
    const principal = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPmt = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPmt = monthlyPmt * numberOfPayments;
    const totalInt = totalPmt - principal;

    setMonthlyPayment(monthlyPmt);
    setTotalPayment(totalPmt);
    setTotalInterest(totalInt);
  };

  useEffect(() => {
    calculateLoan();
  }, [propertyPrice, downPayment, loanTerm, interestRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-bahayCebu-green" />
          <CardTitle className="text-xl font-serif text-bahayCebu-darkGray">Loan Calculator</CardTitle>
        </div>
        <CardDescription>
          Estimate your monthly mortgage payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price Display */}
        <div className="bg-gradient-to-br from-bahayCebu-beige/30 to-bahayCebu-green/5 p-4 rounded-xl">
          <Label className="text-sm text-bahayCebu-darkGray/70">Property Price</Label>
          <div className="text-2xl font-bold text-bahayCebu-darkGray">
            {formatCurrency(propertyPrice)}
          </div>
        </div>

        {/* Down Payment Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm text-bahayCebu-darkGray/70">Down Payment</Label>
            <span className="text-sm font-medium text-bahayCebu-green">{downPayment}%</span>
          </div>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            min={20}
            max={50}
            step={5}
            className="py-4"
          />
          <div className="text-xs text-bahayCebu-darkGray/60">
            Amount: {formatCurrency(propertyPrice * (downPayment / 100))}
          </div>
        </div>

        {/* Loan Term Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm text-bahayCebu-darkGray/70">Loan Term</Label>
            <span className="text-sm font-medium text-bahayCebu-green">{loanTerm} years</span>
          </div>
          <Slider
            value={[loanTerm]}
            onValueChange={(value) => setLoanTerm(value[0])}
            min={5}
            max={30}
            step={5}
            className="py-4"
          />
        </div>

        {/* Interest Rate Input */}
        <div className="space-y-2">
          <Label className="text-sm text-bahayCebu-darkGray/70">Interest Rate (%)</Label>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min={1}
            max={20}
            step={0.1}
            className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-bahayCebu-green/5 p-4 rounded-xl">
            <Label className="text-sm text-bahayCebu-darkGray/70">Monthly Payment</Label>
            <div className="text-lg font-bold text-bahayCebu-green mt-1">
              {formatCurrency(monthlyPayment)}
            </div>
          </div>
          <div className="bg-bahayCebu-beige/20 p-4 rounded-xl">
            <Label className="text-sm text-bahayCebu-darkGray/70">Total Payment</Label>
            <div className="text-lg font-bold text-bahayCebu-darkGray mt-1">
              {formatCurrency(totalPayment)}
            </div>
          </div>
          <div className="bg-bahayCebu-terracotta/5 p-4 rounded-xl">
            <Label className="text-sm text-bahayCebu-darkGray/70">Total Interest</Label>
            <div className="text-lg font-bold text-bahayCebu-terracotta mt-1">
              {formatCurrency(totalInterest)}
            </div>
          </div>
        </div>

        <div className="text-xs text-bahayCebu-darkGray/60 text-center pt-2">
          * This is an estimate. Actual loan terms and rates may vary.
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanCalculator; 