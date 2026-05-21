import DeepDive from '../models/DeepDive.js';

// ✅ 1. GET all Deep Dive cards — ensures always 4
export const getAllDeepDives = async (req, res) => {
  try {
    let items = await DeepDive.find();

    const needed = 4 - items.length;
    if (needed > 0) {
      const defaultCards = [
        {
          title: "Biggest Drone Attack By Pakistan",
          category: "India News",
          img: "https://via.placeholder.com/400x200?text=Card+Image+1",
          content: "Over 100 drones launched, targeting India hours after ceasefire announcement.",
          heading: "Biggest Drone Attack By Pakistan In 3 Days",
          image: "https://via.placeholder.com/800x400?text=Main+Image+1",
          sections: [
            {
              subheading: "India’s Response",
              paragraph: "India activated air defence systems and responded strongly...",
              image: "https://via.placeholder.com/700x300?text=Response+Image",
              video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        },
        {
          title: "UPI Hits New Record",
          category: "Republic Business",
          img: "https://via.placeholder.com/400x200?text=Card+Image+2",
          content: "18 billion transactions in March signal UPI’s unstoppable rise.",
          heading: "India’s UPI Revolution",
          image: "https://via.placeholder.com/800x400?text=UPI",
          sections: [
            {
              subheading: "What is UPI?",
              paragraph: "UPI allows seamless money transfers between any two bank accounts...",
              image: "",
              video: ""
            }
          ]
        },
        {
          title: "India’s Clean Energy Push",
          category: "Environment",
          img: "https://via.placeholder.com/400x200?text=Card+Image+3",
          content: "India ramps up solar, wind power to meet 2030 targets.",
          heading: "India’s Green Revolution",
          image: "https://via.placeholder.com/800x400?text=Green+Energy",
          sections: [
            {
              subheading: "Solar on the Rise",
              paragraph: "Solar energy now powers millions of homes across India...",
              image: "",
              video: ""
            }
          ]
        },
        {
          title: "AI in Indian Classrooms",
          category: "Education",
          img: "https://via.placeholder.com/400x200?text=Card+Image+4",
          content: "How artificial intelligence is changing how students learn.",
          heading: "Smart Learning: AI in Education",
          image: "https://via.placeholder.com/800x400?text=AI+Education",
          sections: [
            {
              subheading: "Personalised Lessons",
              paragraph: "AI systems adapt to each student’s pace, improving retention...",
              image: "",
              video: ""
            }
          ]
        }
      ];

      const toInsert = defaultCards.slice(0, needed);
      await DeepDive.insertMany(toInsert);
      items = await DeepDive.find(); // get updated 4
    }

    res.json(items.slice(0, 4));
  } catch (err) {
    console.error("Error in getAllDeepDives:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ 2. GET one article by ID
export const getDeepDiveById = async (req, res) => {
  try {
    const item = await DeepDive.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Article not found" });
    res.json(item);
  } catch (err) {
    console.error("Error in getDeepDiveById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ 3. UPDATE article/card by ID
export const updateDeepDive = async (req, res) => {
  try {
    const updated = await DeepDive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Update failed" });
    res.json(updated);
  } catch (err) {
    console.error("Error in updateDeepDive:", err);
    res.status(500).json({ message: "Server error" });
  }
};
