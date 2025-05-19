const API_BASE = "https://localhost:5001/api/project"; // adjust if needed

const api = {
  saveProject: async (json) => {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json })
    });
  },

  loadProject: async () => {
    const response = await fetch(API_BASE);
    if (response.ok) {
      return await response.json();
    }
    return null;
  }
};

export default api;
