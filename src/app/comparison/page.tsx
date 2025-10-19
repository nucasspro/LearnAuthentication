/**
 * Authentication Methods Comparison Page
 * Compare Session, JWT, OAuth, and SAML
 * Modern responsive design with shadcn/ui components
 */

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/shared';
import {
  Check,
  X,
  AlertTriangle,
  Server,
  Smartphone,
  Globe,
  Lock,
  Users,
  Code,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface ComparisonFeature {
  feature: string;
  session: {
    status: 'yes' | 'no' | 'partial';
    text: string;
  };
  jwt: {
    status: 'yes' | 'no' | 'partial';
    text: string;
  };
  oauth: {
    status: 'yes' | 'no' | 'partial';
    text: string;
  };
  saml: {
    status: 'yes' | 'no' | 'partial';
    text: string;
  };
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: 'Stateless',
    session: { status: 'no', text: 'No' },
    jwt: { status: 'yes', text: 'Yes' },
    oauth: { status: 'yes', text: 'Yes' },
    saml: { status: 'yes', text: 'Yes' },
  },
  {
    feature: 'Scalable',
    session: { status: 'partial', text: 'With sticky sessions/Redis' },
    jwt: { status: 'yes', text: 'Highly' },
    oauth: { status: 'yes', text: 'Highly' },
    saml: { status: 'yes', text: 'Highly' },
  },
  {
    feature: 'Revokable',
    session: { status: 'yes', text: 'Yes (delete session)' },
    jwt: { status: 'no', text: 'Requires blacklist' },
    oauth: { status: 'yes', text: 'Yes (revoke token)' },
    saml: { status: 'yes', text: 'Yes' },
  },
  {
    feature: 'Mobile Friendly',
    session: { status: 'partial', text: 'Cookies complex' },
    jwt: { status: 'yes', text: 'Excellent' },
    oauth: { status: 'yes', text: 'Excellent' },
    saml: { status: 'partial', text: 'Complex' },
  },
  {
    feature: 'Cross-Domain',
    session: { status: 'no', text: 'Same-site only' },
    jwt: { status: 'yes', text: 'CORS support' },
    oauth: { status: 'yes', text: 'Cross-domain' },
    saml: { status: 'yes', text: 'Cross-domain' },
  },
  {
    feature: 'Storage',
    session: { status: 'partial', text: 'Server-side' },
    jwt: { status: 'partial', text: 'Client-side' },
    oauth: { status: 'partial', text: 'Token server' },
    saml: { status: 'partial', text: 'Identity Provider' },
  },
  {
    feature: 'Complexity',
    session: { status: 'yes', text: 'Simple' },
    jwt: { status: 'partial', text: 'Moderate' },
    oauth: { status: 'no', text: 'Complex' },
    saml: { status: 'no', text: 'Very Complex' },
  },
  {
    feature: 'Third-Party Auth',
    session: { status: 'no', text: 'No' },
    jwt: { status: 'no', text: 'No' },
    oauth: { status: 'yes', text: 'Yes' },
    saml: { status: 'yes', text: 'Yes (Enterprise)' },
  },
];

const StatusBadge: React.FC<{ status: 'yes' | 'no' | 'partial'; text: string }> = ({
  status,
  text,
}) => {
  if (status === 'yes') {
    return (
      <Badge className="inline-flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-700">
        <CheckCircle2 className="w-3 h-3" />
        {text}
      </Badge>
    );
  }

  if (status === 'no') {
    return (
      <Badge className="inline-flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-700">
        <XCircle className="w-3 h-3" />
        {text}
      </Badge>
    );
  }

  return (
    <Badge className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-700">
      <AlertCircle className="w-3 h-3" />
      {text}
    </Badge>
  );
};

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Authentication Methods Comparison
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Understanding the differences, use cases, and trade-offs
          </p>
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <Card className="hidden lg:block mb-12 p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold">Session/Cookie</th>
                  <th className="px-6 py-4 text-center font-bold">JWT</th>
                  <th className="px-6 py-4 text-center font-bold">OAuth 2.0</th>
                  <th className="px-6 py-4 text-center font-bold">SAML</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={row.session.status} text={row.session.text} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={row.jwt.status} text={row.jwt.text} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={row.oauth.status} text={row.oauth.text} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={row.saml.status} text={row.saml.text} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile Card View - Visible on mobile only */}
        <div className="lg:hidden space-y-6 mb-12">
          {comparisonData.map((row, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{row.feature}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Session/Cookie
                  </span>
                  <StatusBadge status={row.session.status} text={row.session.text} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    JWT
                  </span>
                  <StatusBadge status={row.jwt.status} text={row.jwt.text} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    OAuth 2.0
                  </span>
                  <StatusBadge status={row.oauth.status} text={row.oauth.text} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    SAML
                  </span>
                  <StatusBadge status={row.saml.status} text={row.saml.text} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Use Cases & Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Session/Cookie */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
                    Session/Cookie
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Best For:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        Traditional web apps
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        Server-rendered pages
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        Same-domain applications
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        Simple authentication needs
                      </li>
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Examples:
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      WordPress, Drupal, traditional CMS
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JWT */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl text-green-600 dark:text-green-400">
                    JWT
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Best For:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        RESTful APIs
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        Microservices
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        Mobile applications
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        SPAs (Single Page Apps)
                      </li>
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Examples:
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      React apps, Mobile APIs, GraphQL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OAuth 2.0 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-purple-600 dark:text-purple-400">
                    OAuth 2.0
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Best For:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        Third-party auth (Google, GitHub)
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        API authorization
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        Resource delegation
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        Social login
                      </li>
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Examples:
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Login with Google, GitHub API access
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SAML */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl text-orange-600 dark:text-orange-400">
                    SAML
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Best For:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        Enterprise SSO
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        Corporate environments
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        B2B applications
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        Compliance requirements
                      </li>
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Examples:
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Okta, Azure AD, Salesforce SSO
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Decision Tree */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Decision Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg hover:shadow-md transition-shadow">
                <Server className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Building a traditional web app with server rendering?
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Use <strong className="text-blue-600 dark:text-blue-400">Session/Cookie</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border-l-4 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 rounded-r-lg hover:shadow-md transition-shadow">
                <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Building an API or mobile app?
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Use <strong className="text-green-600 dark:text-green-400">JWT</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border-l-4 border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg hover:shadow-md transition-shadow">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Need users to login with Google/GitHub/Facebook?
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Use <strong className="text-purple-600 dark:text-purple-400">OAuth 2.0</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border-l-4 border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg hover:shadow-md transition-shadow">
                <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Enterprise SSO or corporate authentication?
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Use <strong className="text-orange-600 dark:text-orange-400">SAML</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
