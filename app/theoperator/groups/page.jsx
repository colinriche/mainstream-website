 "use client";

 import { useState, useEffect } from "react";
 import Link from "next/link";
 import { useRouter } from "next/navigation";
 import { ArrowLeft, Users, Loader2 } from "lucide-react";
 import {
   themes,
   getStoredTheme,
   getStoredDarkMode,
   DEFAULT_GUEST_THEME,
   DEFAULT_GUEST_DARK_MODE,
 } from "@/lib/siteThemes";
 import { getOperatorAuth } from "@/lib/operatorAuth";
 import { isOperatorConfigMissing } from "@/lib/firebaseOperator";
 import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   onAuthStateChanged,
 } from "firebase/auth";
 import { subscribeGroup, upsertGroup } from "@/lib/operatorGroups";

 export default function OperatorGroupsPage() {
   const router = useRouter();
   const [theme, setTheme] = useState(DEFAULT_GUEST_THEME);
   const [darkMode, setDarkMode] = useState(DEFAULT_GUEST_DARK_MODE);
   const [mounted, setMounted] = useState(false);
   const [configMissing, setConfigMissing] = useState(false);

   const [authUser, setAuthUser] = useState(null);
   const [loadingAuth, setLoadingAuth] = useState(true);

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [authMode, setAuthMode] = useState("login"); // login | signup
   const [authError, setAuthError] = useState("");
   const [authSubmitting, setAuthSubmitting] = useState(false);

   const [group, setGroup] = useState({
     title: "",
     description: "",
     ageGroup: "",
     location: "",
     company: "",
     sport: "",
     affiliation: "",
     brandPrimaryColor: "",
     brandSecondaryColor: "",
     brandLogoUrl: "",
     brandBannerUrl: "",
   });
   const [groupLoading, setGroupLoading] = useState(false);
   const [groupSaving, setGroupSaving] = useState(false);
   const [groupError, setGroupError] = useState("");
   const [groupSaved, setGroupSaved] = useState(false);

   useEffect(() => {
     setTheme(getStoredTheme());
     setDarkMode(getStoredDarkMode());
     setMounted(true);
     setConfigMissing(isOperatorConfigMissing());
   }, []);

   useEffect(() => {
     const auth = getOperatorAuth();
     if (!auth) {
       setLoadingAuth(false);
       return;
     }
     const unsub = onAuthStateChanged(auth, (user) => {
       setAuthUser(user);
       setLoadingAuth(false);
     });
     return () => unsub();
   }, []);

   useEffect(() => {
     if (!authUser?.uid) return;
     setGroupLoading(true);
     const unsub = subscribeGroup(authUser.uid, (data) => {
       if (data) {
         setGroup((prev) => ({
           ...prev,
           title: data.title ?? "",
           description: data.description ?? "",
           ageGroup: data.ageGroup ?? "",
           location: data.location ?? "",
           company: data.company ?? "",
           sport: data.sport ?? "",
           affiliation: data.affiliation ?? "",
           brandPrimaryColor: data.brandPrimaryColor ?? "",
           brandSecondaryColor: data.brandSecondaryColor ?? "",
           brandLogoUrl: data.brandLogoUrl ?? "",
           brandBannerUrl: data.brandBannerUrl ?? "",
         }));
       }
       setGroupLoading(false);
     });
     return () => unsub();
   }, [authUser?.uid]);

   const handleAuthSubmit = async (e) => {
     e.preventDefault();
     setAuthError("");
     setAuthSubmitting(true);
     try {
       const auth = getOperatorAuth();
       if (!auth) {
         if (isOperatorConfigMissing()) {
           throw new Error(
             "Operator Firebase is not configured. Set NEXT_PUBLIC_OPERATOR_FIREBASE_* env vars and rebuild."
           );
         }
         throw new Error("Operator auth not available. Refresh and try again.");
       }
       if (!email || !password) {
         throw new Error("Enter email and password.");
       }
       if (authMode === "signup") {
         await createUserWithEmailAndPassword(auth, email, password);
       } else {
         await signInWithEmailAndPassword(auth, email, password);
       }
     } catch (err) {
       setAuthError(err.message || "Authentication failed.");
     } finally {
       setAuthSubmitting(false);
     }
   };

   const handleSaveGroup = async (e) => {
     e.preventDefault();
     if (!authUser?.uid) return;
     setGroupError("");
     setGroupSaved(false);
     setGroupSaving(true);
     try {
       await upsertGroup(authUser.uid, group);
       setGroupSaved(true);
     } catch (err) {
       setGroupError(err.message || "Failed to save group.");
     } finally {
       setGroupSaving(false);
     }
   };

   const currentTheme = themes[theme];
   const bgGradient = darkMode ? currentTheme.dark : currentTheme.light;
   const textPrimary = darkMode ? "text-white" : "text-gray-900";
   const textMuted =
     theme === "black" && darkMode
       ? "text-yellow-300"
       : darkMode
       ? "text-gray-400"
       : "text-gray-600";
   const cardBg = darkMode ? "bg-gray-800/90" : "bg-white/95";
   const inputClass = `w-full px-4 py-2 rounded-lg border-2 ${
     darkMode ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"
   } focus:outline-none focus:ring-2 ${currentTheme.border}`;

   if (!mounted) {
     return (
       <div className="min-h-screen dark bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
         <div className="animate-spin rounded-full h-10 w-10 border-2 border-yellow-400/60 border-t-transparent" />
       </div>
     );
   }

   return (
     <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "dark" : ""}`}>
       <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-500 pb-20`}>
         <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
           <div className="flex items-center justify-between mb-6">
             <Link
               href="/theoperator"
               className={`inline-flex items-center gap-2 ${textMuted} hover:opacity-90`}
             >
               <ArrowLeft className="w-4 h-4" />
               The Operator
             </Link>
             {authUser && (
               <span className={`text-xs ${textMuted}`}>{authUser.email}</span>
             )}
           </div>

           <h1 className={`text-2xl font-bold ${textPrimary} mb-4`}>Group Admins</h1>
           <p className={`text-sm ${textMuted} mb-6`}>
             Sign in with email and password to create and manage a group page for your club,
             organisation, interest group or community.
           </p>

           {configMissing && (
             <div
               className={`mb-4 p-3 rounded-lg text-sm ${
                 darkMode ? "bg-amber-900/30 text-amber-200" : "bg-amber-50 text-amber-900"
               }`}
             >
               Operator Firebase is not configured. Add{" "}
               <code className="text-xs">NEXT_PUBLIC_OPERATOR_FIREBASE_API_KEY</code>,{" "}
               <code className="text-xs">NEXT_PUBLIC_OPERATOR_FIREBASE_PROJECT_ID</code> and the
               other <code className="text-xs">NEXT_PUBLIC_OPERATOR_FIREBASE_*</code> variables to
               your environment and rebuild.
             </div>
           )}

           {!authUser && (
             <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
               <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-xl ${currentTheme.accent} text-white`}>
                   <Users className="w-6 h-6" />
                 </div>
                 <h2 className={`text-lg font-semibold ${textPrimary}`}>
                   {authMode === "signup" ? "Create Group Admin account" : "Group Admin login"}
                 </h2>
               </div>
               <form onSubmit={handleAuthSubmit} className="space-y-4">
                 <div>
                   <label className={`block text-sm font-medium ${textPrimary}`}>Email</label>
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className={inputClass}
                     autoComplete="email"
                     disabled={authSubmitting}
                   />
                 </div>
                 <div>
                   <label className={`block text-sm font-medium ${textPrimary}`}>Password</label>
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className={inputClass}
                     autoComplete="current-password"
                     disabled={authSubmitting}
                   />
                 </div>
                 {authError && <p className="text-sm text-red-400">{authError}</p>}
                 <button
                   type="submit"
                   disabled={authSubmitting}
                   className={`w-full py-3 rounded-lg font-semibold text-white ${currentTheme.accent} ${currentTheme.accentHover} flex items-center justify-center gap-2 disabled:opacity-50`}
                 >
                   {authSubmitting ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : authMode === "signup" ? (
                     "Create account"
                   ) : (
                     "Log in"
                   )}
                 </button>
               </form>
               <button
                 type="button"
                 onClick={() => {
                   setAuthMode(authMode === "signup" ? "login" : "signup");
                   setAuthError("");
                 }}
                 className={`mt-4 text-sm ${textMuted} hover:underline`}
               >
                 {authMode === "signup"
                   ? "Already have an account? Log in"
                   : "Need an account? Create one"}
               </button>
             </div>
           )}

           {authUser && (
             <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
               <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-xl ${currentTheme.accent} text-white`}>
                   <Users className="w-6 h-6" />
                 </div>
                 <h2 className={`text-lg font-semibold ${textPrimary}`}>Group profile</h2>
               </div>
               {groupLoading && (
                 <p className={`text-sm ${textMuted} mb-4`}>Loading existing group details…</p>
               )}
               <form onSubmit={handleSaveGroup} className="space-y-4">
                 <div>
                   <label className={`block text-sm font-medium ${textPrimary}`}>Title</label>
                   <input
                     type="text"
                     value={group.title}
                     onChange={(e) => setGroup({ ...group, title: e.target.value })}
                     className={inputClass}
                   />
                 </div>
                 <div>
                   <label className={`block text-sm font-medium ${textPrimary}`}>Description</label>
                   <textarea
                     rows={3}
                     value={group.description}
                     onChange={(e) => setGroup({ ...group, description: e.target.value })}
                     className={inputClass}
                   />
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>Age group</label>
                     <input
                       type="text"
                       value={group.ageGroup}
                       onChange={(e) => setGroup({ ...group, ageGroup: e.target.value })}
                       placeholder="e.g. 18+, Families, Seniors"
                       className={inputClass}
                     />
                   </div>
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>Location</label>
                     <input
                       type="text"
                       value={group.location}
                       onChange={(e) => setGroup({ ...group, location: e.target.value })}
                       placeholder="City, region or online"
                       className={inputClass}
                     />
                   </div>
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>
                       Company / organisation
                     </label>
                     <input
                       type="text"
                       value={group.company}
                       onChange={(e) => setGroup({ ...group, company: e.target.value })}
                       className={inputClass}
                     />
                   </div>
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>Sport</label>
                     <input
                       type="text"
                       value={group.sport}
                       onChange={(e) => setGroup({ ...group, sport: e.target.value })}
                       placeholder="e.g. Football, Running, Yoga"
                       className={inputClass}
                     />
                   </div>
                 </div>
                 <div>
                   <label className={`block text-sm font-medium ${textPrimary}`}>Affiliation</label>
                   <input
                     type="text"
                     value={group.affiliation}
                     onChange={(e) => setGroup({ ...group, affiliation: e.target.value })}
                     placeholder="League, network or community you belong to"
                     className={inputClass}
                   />
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>
                       Brand primary colour
                     </label>
                     <input
                       type="text"
                       value={group.brandPrimaryColor}
                       onChange={(e) =>
                         setGroup({ ...group, brandPrimaryColor: e.target.value })
                       }
                       placeholder="#00A676"
                       className={inputClass}
                     />
                   </div>
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>
                       Brand secondary colour
                     </label>
                     <input
                       type="text"
                       value={group.brandSecondaryColor}
                       onChange={(e) =>
                         setGroup({ ...group, brandSecondaryColor: e.target.value })
                       }
                       placeholder="#FFCC00"
                       className={inputClass}
                     />
                   </div>
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>Logo URL</label>
                     <input
                       type="text"
                       value={group.brandLogoUrl}
                       onChange={(e) =>
                         setGroup({ ...group, brandLogoUrl: e.target.value })
                       }
                       placeholder="https://…/logo.png"
                       className={inputClass}
                     />
                   </div>
                   <div>
                     <label className={`block text-sm font-medium ${textPrimary}`}>
                       Banner image URL
                     </label>
                     <input
                       type="text"
                       value={group.brandBannerUrl}
                       onChange={(e) =>
                         setGroup({ ...group, brandBannerUrl: e.target.value })
                       }
                       placeholder="https://…/banner.jpg"
                       className={inputClass}
                     />
                   </div>
                 </div>
                 {groupError && <p className="text-sm text-red-400">{groupError}</p>}
                 {groupSaved && !groupError && (
                   <p className="text-sm text-green-400">Group saved.</p>
                 )}
                 <button
                   type="submit"
                   disabled={groupSaving}
                   className={`mt-2 py-2 px-4 rounded-lg font-semibold text-white ${currentTheme.accent} ${currentTheme.accentHover} flex items-center gap-2 disabled:opacity-50`}
                 >
                   {groupSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save group"}
                 </button>
               </form>
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }

