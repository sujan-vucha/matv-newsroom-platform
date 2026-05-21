import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const sections = [
    { title: "Update Homepage Section", path: "/admin/update-homepage", emoji: "✏️", color: "blue" },
    { title: "Update MATV News Section", path: "/admin/update-matv", emoji: "📺", color: "purple" },
    { title: "Manage Deep Dive Articles", path: "/admin/update-deep-dive", emoji: "🧠", color: "orange" },
    { title: "Update World News & Recommended", path: "/admin/update-world-news", emoji: "📰", color: "red" },
    { title: "Update Viral News", path: "/admin/update-viral-news", emoji: "🧨", color: "pink" },
    { title: "Update Latest News", path: "/admin/update-latest-news", emoji: "🧨", color: "pink" },
    { title: "Update India News", path: "/admin/update-india-news", emoji: "🧨", color: "pink" },
    { title: "Update Web Stories", path: "/admin/update-web-stories", emoji: "🧨", color: "pink" },
    { title: "Update Science News", path: "/admin/update-science-news", emoji: "🔬", color: "teal" },
    { title: "Update Opinion Articles", path: "/admin/update-opinion", emoji: "📝", color: "gray" },
    { title: "Update Entertainment Articles", path: "/admin/update-entertainment", emoji: "🎬", color: "yellow" },
    { title: "Update Defence Articles", path: "/admin/update-defence", emoji: "🛡️", color: "green" },
    { title: "Update Sportfit Articles", path: "/admin/update-sportfit", emoji: "🏋️‍♂️", color: "lime" },
    { title: "Update Education Articles", path: "/admin/update-education", emoji: "📘", color: "indigo" },
    { title: "Update Election News", path: "/admin/update-election-news", emoji: "🗳️", color: "rose" },
    { title: "Update Health Articles", path: "/admin/update-health", emoji: "💊", color: "emerald" },
    { title: "Update Tech Articles", path: "/admin/update-tech", emoji: "💻", color: "sky" },
    { title: "Update Initiatives", path: "/admin/update-initiatives", emoji: "🌟", color: "indigo" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">🛠️ Admin Dashboard</h1>
        <p className="text-gray-600 mb-10">Manage all homepage sections and news categories from one place</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sections.map((section, idx) => (
            <button
              key={idx}
              onClick={() => navigate(section.path)}
              className={`bg-${section.color}-100 border border-${section.color}-300 hover:bg-${section.color}-200 text-${section.color}-900 font-semibold rounded-lg px-4 py-5 shadow-sm transition-all duration-200`}
            >
              <div className="text-3xl mb-2">{section.emoji}</div>
              <div className="text-sm">{section.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
