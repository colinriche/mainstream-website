"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  Timestamp 
} from "firebase/firestore";
import { LogOut, Mail, Phone, User, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all"); // all, contact, pledge

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const unsubscribes = [];

    if (typeFilter === "all" || typeFilter === "contact") {
      const q1 = query(
        collection(db, "contactSubmissions"),
        orderBy("timestamp", "desc")
      );
      const unsub1 = onSnapshot(q1, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          type: "contact",
          ...doc.data(),
        }));
        
        setSubmissions((prev) => {
          const other = prev.filter((s) => s.type !== "contact");
          return [...other, ...data].sort((a, b) => {
            const aTime = a.timestamp?.toDate?.() || a.timestamp || new Date(0);
            const bTime = b.timestamp?.toDate?.() || b.timestamp || new Date(0);
            return bTime - aTime;
          });
        });
      });
      unsubscribes.push(unsub1);
    }
    
    if (typeFilter === "all" || typeFilter === "pledge") {
      const q2 = query(
        collection(db, "pledgeSubmissions"),
        orderBy("timestamp", "desc")
      );
      const unsub2 = onSnapshot(q2, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          type: "pledge",
          ...doc.data(),
        }));
        
        setSubmissions((prev) => {
          const other = prev.filter((s) => s.type !== "pledge");
          return [...other, ...data].sort((a, b) => {
            const aTime = a.timestamp?.toDate?.() || a.timestamp || new Date(0);
            const bTime = b.timestamp?.toDate?.() || b.timestamp || new Date(0);
            return bTime - aTime;
          });
        });
      });
      unsubscribes.push(unsub2);
    }

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [user, typeFilter]);

  const markAsRead = async (id, currentStatus, type) => {
    try {
      const collectionName = type === "pledge" ? "pledgeSubmissions" : "contactSubmissions";
      await updateDoc(doc(db, collectionName, id), {
        read: !currentStatus,
      });
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const filteredSubmissions = submissions.filter((submission) => {
    // Type filter is handled by the useEffect, so we only need to filter by read status here
    if (filter === "unread") return !submission.read;
    if (filter === "read") return submission.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Contact Form Submissions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {submissions.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setTypeFilter("contact")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "contact"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Contact
              </button>
              <button
                onClick={() => setTypeFilter("pledge")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "pledge"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Pledge
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "unread"
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "read"
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No submissions found
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 ${
                  submission.read
                    ? "border-gray-300 dark:border-gray-600"
                    : "border-green-600"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {submission.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        submission.type === "pledge"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}>
                        {submission.type === "pledge" ? "Pledge" : "Contact"}
                      </span>
                      {!submission.read && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${submission.email}`}
                          className="hover:text-green-600 dark:hover:text-green-400"
                        >
                          {submission.email}
                        </a>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <a
                            href={`tel:${submission.phone}`}
                            className="hover:text-green-600 dark:hover:text-green-400"
                          >
                            {submission.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(submission.timestamp)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => markAsRead(submission.id, submission.read, submission.type)}
                    className={`p-2 rounded-lg transition-colors ${
                      submission.read
                        ? "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        : "text-green-600 hover:text-green-700"
                    }`}
                    title={submission.read ? "Mark as unread" : "Mark as read"}
                  >
                    {submission.read ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {submission.type === "pledge" && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span>
                        <span className="text-green-600 dark:text-green-400 font-bold">£{submission.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Project:</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {submission.project === "all" ? "All Projects" : `Project #${submission.project}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {submission.message || "No message provided"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
