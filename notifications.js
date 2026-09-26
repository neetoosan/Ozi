/**
 * Scheduled Push Notifications & Reminder Engine for Ozioma
 * Times:
 * - 🌅 Morning: 8:00 AM
 * - ☀️ Afternoon: 1:00 PM (13:00)
 * - 🌙 Night: 8:00 PM (20:00)
 * - 🌌 Midnight: 12:00 AM (00:00)
 */

class LoveNotificationManager {
  constructor() {
    this.swRegistration = null;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.permission = 'default';
    this.checkInterval = null;
    this.slots = [
      { id: 'morning', hour: 8, minute: 0 },
      { id: 'afternoon', hour: 13, minute: 0 },
      { id: 'night', hour: 20, minute: 0 },
      { id: 'midnight', hour: 0, minute: 0 }
    ];
  }

  async init() {
    if (!this.isSupported) {
      console.warn('Notifications or Service Worker not supported in this browser environment.');
      return;
    }

    this.permission = Notification.permission;

    // Register Service Worker
    try {
      this.swRegistration = await navigator.serviceWorker.register('./sw.js');
      console.log('Service Worker registered successfully for Ozioma:', this.swRegistration);
    } catch (err) {
      console.warn('Service Worker registration warning:', err);
    }

    // Start background check loop (every 30 seconds)
    this.startScheduler();
  }

  // Request browser notification permission from Ozioma
  async requestPermission() {
    if (!this.isSupported) {
      alert("Push notifications are not supported by this browser.");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;

      if (result === 'granted') {
        this.showImmediateLoveNotification(
          "💖 Love Reminders Activated!",
          "I will send you sweet love thoughts every morning, afternoon, night, and midnight, Ozioma! ✨"
        );
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error('Permission request error:', e);
      return false;
    }
  }

  // Show immediate notification
  showImmediateLoveNotification(title, body) {
    if (Notification.permission !== 'granted') return;

    const options = {
      body: body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>",
      vibrate: [200, 100, 200],
      tag: 'ozi-love-reminder',
      renotify: true
    };

    if (this.swRegistration && 'showNotification' in this.swRegistration) {
      this.swRegistration.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  }

  // Continuous Scheduler loop (checks every 30s)
  startScheduler() {
    if (this.checkInterval) clearInterval(this.checkInterval);

    const checkAndTrigger = () => {
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD

      this.slots.forEach((slot) => {
        // Match hour and minute window (within 5 minutes of target)
        if (currentHour === slot.hour && currentMinute >= slot.minute && currentMinute < slot.minute + 5) {
          const sentKey = `notif_sent_${dateKey}_${slot.id}`;
          const alreadySent = localStorage.getItem(sentKey);

          if (!alreadySent) {
            localStorage.setItem(sentKey, 'true');
            if (window.DAILY_QUOTES_ENGINE) {
              const msgData = window.DAILY_QUOTES_ENGINE.getTimeOfDaySlot(slot.id);
              this.showImmediateLoveNotification(msgData.title, msgData.body);
            }
          }
        }
      });
    };

    // Run check immediately, then every 30 seconds
    checkAndTrigger();
    this.checkInterval = setInterval(checkAndTrigger, 30000);
  }
}

// Export singleton instance
window.loveNotificationManager = new LoveNotificationManager();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.loveNotificationManager.init());
} else {
  window.loveNotificationManager.init();
}
