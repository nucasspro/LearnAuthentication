'use client';

/**
 * OAuth 2.0 Authorization Code Flow Diagram
 * Based on SPECIFICATION Section 4.3, Section 8.3
 * RFC 6749: The OAuth 2.0 Authorization Framework
 *
 * This component visualizes the OAuth 2.0 authorization code flow
 * showing the steps, requests, and responses.
 *
 * Flow Steps:
 * 1. User initiates login
 * 2. App redirects to OAuth authorize endpoint
 * 3. User grants permission (auto-approved in mock)
 * 4. OAuth redirects back with auth code
 * 5. App backend exchanges code for access token
 * 6. App gets user profile using access token
 * 7. App creates session/JWT for user
 * 8. User is logged in to app
 */

import { useState } from 'react';

interface FlowStep {
  id: number;
  title: string;
  description: string;
  actor: 'user' | 'app' | 'oauth';
  request?: string;
  response?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface OAuthFlowDiagramProps {
  onFlowComplete?: () => void;
}

export function OAuthFlowDiagram({ onFlowComplete }: OAuthFlowDiagramProps) {
  const [steps, setSteps] = useState<FlowStep[]>([
    {
      id: 1,
      title: 'User Initiates Login',
      description: 'User clicks "Login with OAuth"',
      actor: 'user',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Redirect to OAuth Authorize',
      description: 'App redirects to OAuth authorize endpoint',
      actor: 'app',
      request: 'GET /authorize?client_id=...&redirect_uri=...&scope=...',
      status: 'pending',
    },
    {
      id: 3,
      title: 'User Grants Permission',
      description: 'User approves access (auto-approved in mock)',
      actor: 'oauth',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Redirect Back with Auth Code',
      description: 'OAuth redirects to callback with auth code',
      actor: 'oauth',
      response: 'Redirect: /callback?code=AUTH_CODE&state=...',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Exchange Code for Token',
      description: 'App backend exchanges auth code for access token',
      actor: 'app',
      request: 'POST /token with code, client_id, client_secret',
      status: 'pending',
    },
    {
      id: 6,
      title: 'Get User Profile',
      description: 'App gets user info using access token',
      actor: 'oauth',
      request: 'GET /userinfo with Authorization header',
      response: '{ id, email, name, picture }',
      status: 'pending',
    },
    {
      id: 7,
      title: 'Create App Session',
      description: 'App creates JWT token for user',
      actor: 'app',
      response: 'Set JWT token / session',
      status: 'pending',
    },
    {
      id: 8,
      title: 'User Logged In',
      description: 'User is now authenticated in the app',
      actor: 'user',
      status: 'pending',
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      const updatedSteps = [...steps];
      updatedSteps[currentStep].status = 'completed';

      // Move to next step
      const nextStepIndex = currentStep + 1;
      updatedSteps[nextStepIndex].status = 'in-progress';

      setSteps(updatedSteps);
      setCurrentStep(nextStepIndex);

      // Call completion callback on final step
      if (nextStepIndex === steps.length - 1) {
        onFlowComplete?.();
      }
    }
  };

  const handleReset = () => {
    const resetSteps: FlowStep[] = steps.map((step) => ({
      ...step,
      status: 'pending' as const,
    }));
    const firstStep = resetSteps[0];
    if (firstStep) {
      firstStep.status = 'in-progress';
    }
    setSteps(resetSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleAutoPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      let step = 0;
      const interval = setInterval(() => {
        const updatedSteps = [...steps];
        if (step < steps.length) {
          updatedSteps[step].status = 'completed';
          if (step < steps.length - 1) {
            updatedSteps[step + 1].status = 'in-progress';
          }
          setSteps(updatedSteps);
          setCurrentStep(step);
          step++;
        } else {
          clearInterval(interval);
          setIsPlaying(false);
          onFlowComplete?.();
        }
      }, 800);
    }
  };

  const getActorColor = (actor: string) => {
    switch (actor) {
      case 'user':
        return 'bg-blue-50 border-blue-200';
      case 'app':
        return 'bg-purple-50 border-purple-200';
      case 'oauth':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'in-progress':
        return 'border-l-4 border-l-blue-500 bg-blue-50 ring-2 ring-blue-300';
      default:
        return 'border-l-4 border-l-gray-300 opacity-60';
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          OAuth 2.0 Authorization Code Flow
        </h2>
        <p className="text-gray-600">
          Interactive visualization of the OAuth authentication process. Click &quot;Next&quot; to step
          through or &quot;Auto Play&quot; to watch the complete flow.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleNextStep}
          disabled={currentStep >= steps.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
        <button
          onClick={handleAutoPlay}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          {isPlaying ? 'Stop' : 'Auto Play'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flow Steps */}
      <div className="space-y-3 mb-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 border rounded-lg transition-all duration-300 ${getStatusStyle(step.status)} ${
              index <= currentStep ? 'opacity-100' : 'opacity-60'
            }`}
          >
            {/* Actor Badge */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded text-sm font-semibold text-gray-700 ${getActorColor(step.actor)}`}>
                  {step.actor.toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-800">{step.title}</h3>
              </div>
              <div className="text-sm">
                {step.status === 'completed' && (
                  <span className="text-green-600 font-semibold">✓ Done</span>
                )}
                {step.status === 'in-progress' && (
                  <span className="text-blue-600 font-semibold animate-pulse">• In Progress</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3">{step.description}</p>

            {/* Request/Response Details */}
            <div className="space-y-2">
              {step.request && (
                <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm">
                  <div className="text-green-400">Request:</div>
                  <div className="text-yellow-300">{step.request}</div>
                </div>
              )}
              {step.response && (
                <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm">
                  <div className="text-green-400">Response:</div>
                  <div className="text-cyan-300">{step.response}</div>
                </div>
              )}
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="mt-3 ml-6 h-3 border-l-2 border-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Flow Diagram */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Flow Diagram</h3>
        <div className="font-mono text-sm text-gray-700 bg-white p-4 rounded border border-gray-200 overflow-x-auto">
          <pre>{`
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Clicks &quot;Login&quot;
     ▼
┌─────────────────────┐
│  Our App            │
│ (React/Next.js)     │
└────┬────────────────┘
     │ 2. Redirects to OAuth
     ▼
┌──────────────────────────┐
│  OAuth Provider          │
│  (Mock - Google/GitHub)  │
│                          │
│  /authorize endpoint     │
│  /callback endpoint      │
│  /token endpoint         │
│  /userinfo endpoint      │
└────┬─────────────────────┘
     │ 3-7. Exchange & validate
     ▼
┌─────────────────────┐
│  User Logged In     │
│  (JWT/Session)      │
└─────────────────────┘

Key Points:
• Steps 1-4: Frontend flow (user&apos;s browser)
• Steps 5-6: Backend flow (app server only)
• Step 7: App creates authentication
• Step 8: User has access
            `}</pre>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-bold text-yellow-900 mb-2">About this Mock Implementation</h3>
        <p className="text-yellow-800 text-sm mb-2">
          This is a simplified mock OAuth implementation for educational purposes. In production:
        </p>
        <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
          <li>Use real OAuth providers (Google, GitHub, Microsoft, etc.)</li>
          <li>Implement PKCE for public clients (browsers, mobile apps)</li>
          <li>Always validate the state parameter to prevent CSRF attacks</li>
          <li>Store tokens in HTTP-Only cookies, not localStorage</li>
          <li>Use HTTPS only (never HTTP)</li>
        </ul>
      </div>
    </div>
  );
}
