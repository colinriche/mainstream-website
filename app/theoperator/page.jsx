"use client";

import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";

export default function TheOperatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mainstream Movement
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gray-900 dark:bg-gray-700 text-white">
              <Phone className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              The Operator Calling App
            </h1>
          </div>
        </header>

        <article className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            When the phone rings you are put on hold while the Operator selects who to connect you with.
          </p>
          <p>
            The Operator will put you through to someone you know or someone you don&apos;t, depending on your selections.
            They may be a member of your interest groups, work related groups, a distant relation or someone just looking for a chat with someone about what&apos;s happening in the world. You won&apos;t know who you are matched with before you answer the call, finding out is all part of the fun—you will just know on what basis you are matched.
          </p>
          <p>
            Once you have created an account you can enter your interests, sports, hobbies etc. and then select the hours of the week when you are available and hours when you are not available. This is for people who like impromptu calls.
          </p>
          <p>
            For the most part calls are scheduled, which is what you select next.
          </p>
          <p>
            When a call arrives, there is no one waiting for you to answer so there is no commitment to take the call.
          </p>
          <p>
            Any sharing of your personal information with other users is completely with your permission and once given you can withdraw it at any time. For example you can allow another user to call you directly by adding them to your friends list; removing them from the list or disabling them removes the right to call you. This means there is no need to share phone numbers with others so your privacy is protected. You can even moderate calls with friends that call too often.
          </p>
          <p>
            The phone system also allows for call-backs so calls with friends are placed when both parties are available.
          </p>
        </article>

        <p className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-lg font-semibold text-gray-900 dark:text-white">
          The Operator App — strengthening communities one to one
        </p>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mainstream Movement
          </Link>
        </div>
      </div>
    </div>
  );
}
