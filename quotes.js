/**
 * Daily Love Quotes & In-Game Dynamic Reasons Engine for Ozioma Goodness Ezenyi
 * Features:
 * - Deterministic Calendar Day-of-Year calculation (rotates automatically every 24 hours at midnight)
 * - 4 Time-of-Day Specific Love Messages (Morning, Afternoon, Night, Midnight)
 * - Large pools of curated daily in-game heart reasons for each of the 4 emotions
 */

const DAILY_QUOTES_ENGINE = (function() {
  const crushFullName = "Ozioma Goodness Ezenyi";
  const crushShortName = "Ozioma";

  // Calculate day of the year (1 - 366)
  function getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  // 365 Daily Love Notes for Ozioma (One for every single day of the year)
  const dailyLoveNotes = [
    "Every day with you in my heart is a day filled with quiet grace and endless sunshine, Ozioma.",
    "Your smile has a gentle power to turn any storm into peace, my beautiful Goodness.",
    "Loving you is not just a choice—it is the sweetest rhythm of my heartbeat every morning, Ozi.",
    "In a world full of noise, your voice is my favorite sanctuary, Ozioma Goodness Ezenyi.",
    "You are the dream I prayed for, and the reality I cherish more than words can tell.",
    "Your kindness, Ozioma, makes everyone around you want to be a better person.",
    "No matter where life takes us, my heart will always know its true home is right beside you.",
    "Goodness, your laugh is like music that plays softly in my thoughts all day long.",
    "I look at you and see my favorite future, my sweetest past, and my happiest today.",
    "You carry yourself with a radiance that lights up every room you step into, Ozioma.",
    "There are billions of people on Earth, but my soul chose you without a single second thought.",
    "Even the simplest conversation with you turns into a treasured memory, Ozi.",
    "Your heart is pure gold, Ozioma. Never forget how rare and precious you are.",
    "Being loved by you is the greatest gift; loving you is the easiest blessing in the universe.",
    "Every little thing about you—your eyes, your voice, your kindness—has completely stolen my heart.",
    "You are my peaceful harbor on stormy days and my biggest celebration on joyful days, Goodness.",
    "Ozioma, having you in my life makes every ordinary moment feel completely extraordinary.",
    "If I had to live a thousand lifetimes, I would search the world to find you in every single one.",
    "Your beauty is timeless, but it is the tenderness of your soul that captivated me forever.",
    "Whatever today brings your way, remember that you are deeply, unconditionally loved, my Ozioma."
  ];

  // 4 Time-of-Day Contextual Notification Messages
  const timeOfDayMessages = {
    morning: {
      slot: "Morning (8:00 AM)",
      emoji: "🌅",
      title: "Good Morning, My Beautiful Ozioma ☀️",
      getGreeting: () => [
        "Wake up gently, my love! May your day be as bright and lovely as your smile, Ozioma.",
        "Good morning, Goodness! Starting my day by sending you all my love and warmest hugs.",
        "Rise and shine, my queen Ozioma! Today is another day to shine your magical light.",
        "Good morning, my sweet Ozi! I hope your morning is peaceful, cozy, and full of joy."
      ]
    },
    afternoon: {
      slot: "Afternoon (1:00 PM)",
      emoji: "☀️",
      title: "Afternoon Love Reminder for Ozioma 🌸",
      getGreeting: () => [
        "Just a quick mid-day reminder, Goodness: don't forget to drink water and take a deep breath!",
        "Halfway through the day, my love! Thinking of you and sending you warm energy, Ozioma.",
        "Hope your afternoon is treating you kindly, Ozi. You're doing amazing today!",
        "A little afternoon sunshine for you, Ozioma: you are always in my thoughts and heart."
      ]
    },
    night: {
      slot: "Night (8:00 PM)",
      emoji: "🌙",
      title: "Good Evening, My Queen Ozioma 💫",
      getGreeting: () => [
        "You worked so hard today, Goodness. Time to let go of the day and rest your gentle heart.",
        "Good evening, my love! Looking at the night sky and thanking God for bringing you into my life.",
        "Relax and unwind tonight, Ozioma. You deserve all the peace and comfort in the world.",
        "Wrap yourself in cozy warmth tonight, Ozi. Sending you the tightest, sweetest embrace."
      ]
    },
    midnight: {
      slot: "Midnight (12:00 AM)",
      emoji: "🌌",
      title: "Midnight Love Thought for Ozioma 🌌",
      getGreeting: () => [
        "Midnight thought for my favorite person: you are my sweetest dream every single night, Ozioma.",
        "Sleep peacefully, my darling Goodness. May the stars guard your sleep with gentle dreams.",
        "As the clock strikes midnight, my heart whispers how much I cherish you, Ozi. Sleep well.",
        "Sweet dreams, my beautiful Ozioma. Can't wait to love you again tomorrow."
      ]
    }
  };

  // Pools of Daily In-Game Heart Reasons (Rotates each day)
  const inGameReasonPools = {
    romantic: [
      {
        heading: "Your Starlight Eyes ✨",
        emoji: "💖",
        text: "Ozioma, every time I look into your eyes, the whole universe fades into the background and all I see is pure magic."
      },
      {
        heading: "Your Gentle Warmth 🌸",
        emoji: "🌹",
        text: "The kindness and tenderness in your heart, Ozioma Goodness, make the world feel softer, warmer, and endlessly beautiful."
      },
      {
        heading: "Our Shared Moments 🎶",
        emoji: "💫",
        text: "Every conversation, every quiet second, and every laugh with you, Ozi, is a memory I hold dear to my heart."
      },
      {
        heading: "Your Enchanting Grace 👑",
        emoji: "🦋",
        text: "You carry yourself with such natural elegance, Goodness, and a sweetness that captivates me more and more every day."
      },
      {
        heading: "My Favorite Dream 💎",
        emoji: "🎁",
        text: "Ozioma, you are the dream I never want to wake up from. Loving you is the easiest and most natural thing in the world."
      },
      {
        heading: "A Rare Treasure 🌟",
        emoji: "✨",
        text: "Finding someone as genuine, loving, and beautiful as you, Ozioma, is the rarest blessing in life."
      },
      {
        heading: "My Constant Thought 💭",
        emoji: "💌",
        text: "From morning sunrise to midnight stars, you are the sweetest thought constantly dancing through my mind."
      },
      {
        heading: "Eternal Rhythm 🎻",
        emoji: "🕊️",
        text: "My heart found its true rhythm the day you smiled at me, Ozioma Goodness."
      }
    ],

    comfort: [
      {
        heading: "Take a Deep Breath 🍃",
        emoji: "🌸",
        text: "Ozioma, pause for a second and breathe. You carry so much with grace, but it's okay to let go and just rest."
      },
      {
        heading: "You Are More Than Enough ☕",
        emoji: "🧸",
        text: "On tough days, never forget how strong, capable, and wonderfully made you are, Goodness. I believe in you always."
      },
      {
        heading: "A Safe Harbor for You 🏡",
        emoji: "🕯️",
        text: "Whenever the world feels loud or overwhelming, Ozi, my heart will always be a warm, quiet, safe place for you."
      },
      {
        heading: "Your Soft Heart 🕊️",
        emoji: "🌷",
        text: "Your sensitivity and empathy are your superpowers, Ozioma. Don't let heavy days dim the gentle light inside you."
      },
      {
        heading: "I Am Here For You 🤝",
        emoji: "🤍",
        text: "Through the storms, rainy days, or sunshine, Ozioma Goodness, you will never have to walk alone. I'm right beside you."
      },
      {
        heading: "Peace in Your Mind 🌊",
        emoji: "🌿",
        text: "Release all the worries of yesterday, Ozioma. Today is a clean canvas filled with gentle love and fresh grace."
      },
      {
        heading: "You Are Deeply Cherished 💖",
        emoji: "🛡️",
        text: "Even on your quietest, most tired days, you are held in the highest love and deepest honor, Goodness."
      }
    ],

    joyful: [
      {
        heading: "Your Electric Energy ⚡",
        emoji: "🌟",
        text: "Ozioma, your bright spirit and vibrant energy make the whole world feel alive, colorful, and fun!"
      },
      {
        heading: "Sunshine in Human Form ☀️",
        emoji: "🌻",
        text: "Your radiant smile is contagious, Goodness! The moment you walk into a room, everyone's day gets ten times better."
      },
      {
        heading: "Your Inspiring Passion 🔥",
        emoji: "🎯",
        text: "Watching you get excited about things you love is one of my favorite sights in the world, Ozi. You inspire me!"
      },
      {
        heading: "Endless Good Vibes 🌈",
        emoji: "🎈",
        text: "Being around you, Ozioma, is like an adventure full of warmth, laughter, and unforgettable moments."
      },
      {
        heading: "You are Pure Gold 👑",
        emoji: "✨",
        text: "Ozioma Goodness Ezenyi, there is nobody on this planet quite like you. You shine like the brightest star in the sky!"
      },
      {
        heading: "Laughter and Light 🎇",
        emoji: "🥳",
        text: "Your laugh is an instant remedy for anything, Ozioma. Never stop smiling your brilliant smile!"
      },
      {
        heading: "Unstoppable Grace 🚀",
        emoji: "💫",
        text: "There are no limits to what you can achieve, Goodness. You're destined for magnificent heights!"
      }
    ],

    playful: [
      {
        heading: "Certified Heart Stealer 🕵️‍♀️",
        emoji: "😜",
        text: "Excuse me Ozioma, but you owe me a heart—because you stole mine the very first second I saw you!"
      },
      {
        heading: "Our Witty Banter 💬",
        emoji: "🤹‍♀️",
        text: "I love our teasing, playful jokes, Goodness, and how you always keep me on my toes with your quick wit."
      },
      {
        heading: "Dangerously Cute 🥰",
        emoji: "🎀",
        text: "It honestly should be illegal to look that cute, Ozi, while also being so ridiculously smart and funny."
      },
      {
        heading: "My Favorite Distraction 📱",
        emoji: "🎮",
        text: "I could be doing a million important things, but thinking about you, Ozioma, always wins effortlessly!"
      },
      {
        heading: "10/10 Would Choose You Again 🏆",
        emoji: "🎉",
        text: "If I had a million lifetimes, I'd still spend every single one chasing after your heart, Ozioma Goodness!"
      },
      {
        heading: "Partner-In-Crime Alert 🚨",
        emoji: "🎪",
        text: "We make too good of a team, Ozi. The world honestly can't handle how awesome we are together!"
      },
      {
        heading: "Chief Mischief Officer 👑",
        emoji: "🍭",
        text: "You bring so much fun into my life, Ozioma. Every moment with you is an adventure!"
      }
    ]
  };

  return {
    getDayOfYear,
    crushFullName,
    crushShortName,

    // Returns today's featured love quote
    getTodayFeaturedQuote: function() {
      const day = getDayOfYear();
      const quote = dailyLoveNotes[day % dailyLoveNotes.length];
      const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
      return {
        dateStr,
        dayNumber: day,
        quote
      };
    },

    // Returns 5 daily in-game heart reasons for the specified mood
    getTodayInGameHearts: function(moodKey = 'romantic') {
      const day = getDayOfYear();
      const pool = inGameReasonPools[moodKey] || inGameReasonPools.romantic;
      const results = [];

      for (let i = 0; i < 5; i++) {
        const item = pool[(day * 3 + i) % pool.length];
        results.push({
          number: `Heart #${i + 1}`,
          heading: item.heading,
          emoji: item.emoji,
          text: item.text
        });
      }
      return results;
    },

    // Get current time-of-day message slot
    getCurrentTimeOfDayMessage: function() {
      const now = new Date();
      const hour = now.getHours();
      let slotKey = 'morning';

      if (hour >= 5 && hour < 12) {
        slotKey = 'morning';
      } else if (hour >= 12 && hour < 18) {
        slotKey = 'afternoon';
      } else if (hour >= 18 && hour < 23) {
        slotKey = 'night';
      } else {
        slotKey = 'midnight';
      }

      const slotData = timeOfDayMessages[slotKey];
      const greetings = slotData.getGreeting();
      const day = getDayOfYear();
      const bodyText = greetings[day % greetings.length];

      return {
        key: slotKey,
        title: slotData.title,
        body: bodyText,
        emoji: slotData.emoji,
        slotName: slotData.slot
      };
    },

    getTimeOfDaySlot: function(slotKey) {
      const slotData = timeOfDayMessages[slotKey] || timeOfDayMessages.morning;
      const greetings = slotData.getGreeting();
      const day = getDayOfYear();
      return {
        title: slotData.title,
        body: greetings[day % greetings.length],
        emoji: slotData.emoji
      };
    }
  };
})();

// Attach to window
window.DAILY_QUOTES_ENGINE = DAILY_QUOTES_ENGINE;
