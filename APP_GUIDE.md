# RS6 Vedlikehold App - Features & Access Guide

## ✨ Features Added

### 1. **Dark Mode** 🌙
- Click the moon/sun icon in the header to toggle dark/light mode
- Your preference is saved automatically
- Beautifully styled for both modes with appropriate color contrast

### 2. **Maintenance History Tracking** 📋
- Track when each service was performed
- Record the km-stand when service was done
- Add notes about the service work
- View complete service history for each part
- All data is saved locally in your browser

### 3. **PDF Export** 📄
- Export maintenance details as PDF for printing or sharing
- One-click export from the details view
- Includes all maintenance information

### 4. **Service Reminders** 🔔
- Real-time km tracking with visual warnings:
  - 🟢 Green: OK (more than 10,000 km left)
  - 🟡 Yellow: Coming soon (5,000-10,000 km left)
  - 🔴 Red: Urgent (less than 5,000 km left)
  - ⚠️ Alert: Overdue maintenance

---

## 📱 How to Access on Your Work Network

### Option 1: Direct Network Access (Recommended)
The app is running on the dev container's network. Try accessing it from your work device at:

```
http://10.0.10.108:3000
```

If this doesn't work, proceed to Option 2.

### Option 2: VS Code Port Forwarding
If direct access is blocked by your work firewall:

1. In VS Code, look for the "PORTS" tab (next to Terminal)
2. Click "Forward a Port"
3. Enter port: `3000`
4. VS Code will provide a public forwarding URL
5. You can share this URL with others or use it from any device

### Option 3: Deploy to Vercel (Free)
For permanent deployment accessible anywhere:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Connect your GitHub repository
4. Click "Deploy"
5. Get a public URL like `https://rs6-vedlikehold.vercel.app`

---

## 🚀 Usage Guide

### Adding Current KM
1. Enter your car's current km in the header
2. Your data is saved automatically
3. All maintenance items show how many km until next service

### Filtering Maintenance Items
- **Category**: Filter by system (Motor, Elektrisk system, etc.)
- **Status**: Filter by maintenance status (OK, Unknown, etc.)

### Viewing Details
1. Click any maintenance item to see:
   - Recommended interval
   - Last service date and km
   - Next recommended service km
   - Progress bar showing service completion
   - Service history
   - Comments and notes

### Tracking Service History
1. Click **📋 Historikk** button in details view
2. Click **+ Legg til service**
3. Enter:
   - Service date
   - Km-stand at service
   - Optional notes
4. Click "Lagre" to save
5. History shows all past services and is saved in your browser

### Exporting to PDF
1. Open any maintenance item
2. Click **📄 Eksporter PDF**
3. PDF downloads with all details

### Dark Mode
1. Click the **🌙** button in the top-right header
2. Your preference saves automatically

---

## 💾 Your Data
All data is stored locally in your browser using `localStorage`:
- Current km reading
- Service history for each part
- Dark mode preference

**Your data is private and never sent to any server.**

---

## 📝 Maintenance Categories
The app tracks 50 maintenance items across these categories:
- Annet (Other)
- Elektrisk system (Electrical)
- Motor / Drivverk (Engine)
- Bremsesystem (Brakes)
- Hjul og dekk (Wheels/Tires)
- Suspensjons system (Suspension)
- etc.

---

## 🔧 Technical Details
Built with:
- React.js for the UI
- jsPDF & html2canvas for PDF export
- localStorage for data persistence
- Responsive CSS for mobile/tablet support

---

## 📧 Need Help?
If you have issues:
1. Check that the server is running: `npm start` in the project folder
2. Clear browser cache if styles look wrong: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
3. Make sure your browser allows localStorage (check settings)
