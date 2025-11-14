"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, LogOut, List, CreditCard, User, Mail, Trash2, Edit2, Check, X, Crown, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import BeautifulFooter from "@/components/BeautifulFooter";

interface SavedList {
  id: string;
  title: string;
  items: number;
  packed: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [currentPlan, setCurrentPlan] = useState("Free");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const stored = localStorage.getItem("saved_lists");
    if (stored) {
      setSavedLists(JSON.parse(stored));
    }
    if (session?.user?.name) {
      setEditedName(session.user.name);
    }
    
    const plan = localStorage.getItem("user_plan") || "Free";
    setCurrentPlan(plan);
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="floating-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  if (!session) return null;

  const handleDeleteList = (id: string) => {
    const updated = savedLists.filter(list => list.id !== id);
    setSavedLists(updated);
    localStorage.setItem("saved_lists", JSON.stringify(updated));
    toast.success("List deleted");
  };

  const handleSaveName = () => {
    toast.success("Name updated!");
    setIsEditingName(false);
  };

  const handleDownloadList = (list: SavedList) => {
    if (currentPlan === "Free") {
      toast.error("PDF export is a Pro feature!");
      setTimeout(() => router.push("/pricing"), 1500);
      return;
    }
    toast.success("Downloading PDF...");
  };

  const handleShareList = (list: SavedList) => {
    if (currentPlan === "Free") {
      toast.error("Sharing is a Pro feature!");
      setTimeout(() => router.push("/pricing"), 1500);
      return;
    }
    toast.success("Share link copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container-custom px-4 header-compact flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-lg font-bold text-white">PackMind AI</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="h-14" />

      <main className="relative z-10 container-custom section-padding">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome, <span className="gradient-text">{session.user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-white/70">Manage your account and packing lists</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Account Info */}
          <div className="card p-6 shadow-glow-purple animate-fadeIn hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Name</p>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                    <button onClick={handleSaveName} className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      setIsEditingName(false);
                      setEditedName(session.user?.name || "");
                    }} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm">{session.user?.name}</p>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-white/50 hover:text-white" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Email</p>
                <p className="text-white text-sm">{session.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Current Plan */}
          <div className="card p-6 animate-fadeIn hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-bold text-white">Current Plan</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-semibold">{currentPlan}</p>
                  {currentPlan !== "Free" && (
                    <span className="premium-badge">
                      <Crown className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                <ul className="space-y-2 text-xs text-white/80 mb-4">
                  {currentPlan === "Free" ? (
                    <>
                      <li>✓ 3 lists per day</li>
                      <li>✓ Basic features</li>
                      <li className="text-white/40">✗ PDF export</li>
                      <li className="text-white/40">✗ Share lists</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Unlimited lists</li>
                      <li>✓ PDF export</li>
                      <li>✓ Share lists</li>
                      <li>✓ Priority support</li>
                    </>
                  )}
                </ul>
              </div>
              <Link href="/pricing" className="w-full btn-primary text-xs inline-block text-center">
                {currentPlan === "Free" ? "Upgrade Plan" : "Manage Plan"}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-6 animate-fadeIn hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Stats</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Total Lists</p>
                <p className="text-3xl font-bold text-white">{savedLists.length}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Member Since</p>
                <p className="text-white text-sm">November 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Lists */}
        <div className="card p-6 sm:p-8 shadow-glow-purple animate-fadeIn hover-lift">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <List className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Saved Lists</h2>
            </div>
            <Link href="/" className="btn-secondary py-2 px-4 text-xs">
              + New List
            </Link>
          </div>

          {savedLists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/60 mb-4">No saved lists yet</p>
              <Link href="/" className="btn-primary inline-block text-sm">
                Create Your First List
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedLists.map((list) => {
                const progress = list.items > 0 ? Math.round((list.packed / list.items) * 100) : 0;
                return (
                  <div
                    key={list.id}
                    className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all group hover-lift"
                  >
                    <h3 className="text-white font-semibold mb-2 truncate text-sm">{list.title}</h3>
                    <p className="text-white/60 text-xs mb-3">
                      {list.items} items • {new Date(list.createdAt).toLocaleDateString()}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                        <span>Packed</span>
                        <span className="gradient-text font-bold">{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-white/50 mt-1">
                        {list.packed} of {list.items} packed
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadList(list)}
                        className="flex-1 px-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleShareList(list)}
                        className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-all"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BeautifulFooter />
    </div>
  );
}
