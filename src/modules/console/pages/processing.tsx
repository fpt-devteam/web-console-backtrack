import { Loader2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ProcessingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Simulate progress steps
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 2000);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { id: 1, label: 'Verifying details' },
    { id: 2, label: 'Setting up your workspace' },
    { id: 3, label: 'Finalizing account' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-12">
          {/* Loading Spinner */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-3">
            Creating Your Organization Account...
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 text-center mb-10">
            Creating your organization account. This may take a moment while we
            configure your environment.
          </p>

          {/* Progress Steps */}
          <div className="space-y-5">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isPending = currentStep < step.id;

              return (
                <div
                  key={step.id}
                  className="flex items-center gap-3"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {isCurrent && (
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    )}
                    {isPending && (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent
                        ? ''
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning - Outside Card */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Do not close this window.
          </p>
        </div>
      </div>
    </div>
  );
}

