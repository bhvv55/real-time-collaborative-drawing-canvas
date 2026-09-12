# real-time-collaborative-drawing-canvas
# 🎨 Cuddle Canvas

> A cute, real-time collaborative drawing canvas where friends can draw, create, and have fun together.

Cuddle Canvas is a real-time multiplayer drawing application that allows multiple users to join the same room and draw together on a shared canvas. Each participant can see other users' drawing activity, cursors, and interactions instantly.

The project combines **real-time WebSocket communication** with an interactive drawing canvas and a playful, pastel-inspired interface.

---

## ✨ Features

### 🎨 Drawing

* Freehand drawing canvas
* Pencil and eraser tools
* Custom brush colors
* Adjustable brush size
* Clear canvas
* Local undo functionality
* Export drawings as PNG

### 👥 Real-Time Collaboration

* Multiple users can join the same room
* Drawing strokes are synchronized in real time
* Live participant list
* User names and avatars
* Room-based collaboration
* Real-time user activity

### 🧸 Cute & Interactive UI

* Soft pastel visual design
* Cute avatars
* Custom user colors
* Stickers and emojis
* Reactions
* Playful animations
* Responsive design
* Light/dark theme support

---

## 🏗️ System Architecture

```text
                   🎨 Cuddle Canvas
                          │
              ┌───────────┴───────────┐
              │                       │
          Frontend                  Server
              │                       │
       Canvas Renderer           WebSocket
              │                       │
       User Drawing          Real-Time Sync
              │                       │
              └───────────┬───────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
             User A              User B
                │                   │
                └────── Sync ───────┘
```

---

## 🛠️ Tech Stack

| Technology              | Purpose                 |
| ----------------------- | ----------------------- |
| HTML / CSS / JavaScript | Frontend interface      |
| Canvas API              | Drawing functionality   |
| WebSockets              | Real-time communication |
| Node.js                 | Backend runtime         |
| Express.js              | Server-side application |
| npm                     | Package management      |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/cuddle-canvas.git
```

### 2. Navigate to the project

```bash
cd cuddle-canvas
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm run dev
```

### 5. Open the application

```text
http://localhost:3000
```

Open the application in **two browser tabs** or on two different devices and join the same room to test real-time collaboration.

---

## 📂 Project Structure

```text
cuddle-canvas/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server/
│   └── server.js
│
├── package.json
├── package-lock.json
└── README.md
```

> The exact structure may vary depending on the implementation.

---

## 🎯 How It Works

1. A user opens Cuddle Canvas.
2. The user chooses a name and avatar.
3. A collaboration room is created or joined.
4. Users draw on the shared canvas.
5. Drawing strokes are sent through a WebSocket connection.
6. The server broadcasts the drawing data to connected users.
7. Other users see the strokes in real time.
8. Users can add stickers, reactions, and other creative elements.
9. The final artwork can be exported as a PNG image.

---

## 🔮 Future Enhancements

* [ ] Persistent drawing storage
* [ ] Database integration
* [ ] Global undo/redo
* [ ] Animated user cursors
* [ ] Drag-and-drop stickers
* [ ] Text tool
* [ ] Shape drawing tools
* [ ] Image upload
* [ ] Drawing history
* [ ] Room password protection
* [ ] Shareable room links
* [ ] User authentication
* [ ] Mobile touch optimization
* [ ] Improved reconnection handling
* [ ] Drawing replay
* [ ] AI-assisted drawing features

---

## 💡 Use Cases

Cuddle Canvas can be used for:

* 👩‍🎓 Collaborative student activities
* 🎨 Online drawing sessions
* 👯 Friends drawing together
* 🧑‍🏫 Interactive classroom activities
* 💻 Remote team brainstorming
* 🎉 Virtual creative events
* 🧸 Casual multiplayer creativity

---

## 📸 Screenshots

Add screenshots of your application here:

```text
screenshots/
├── home.png
├── canvas.png
├── multiplayer.png
└── mobile.png
```

Example:

![Cuddle Canvas](screenshots/canvas.png)

---

## 📌 Project Goals

The main goals of Cuddle Canvas are to:

* Build a practical real-time web application.
* Understand WebSocket-based communication.
* Implement collaborative state synchronization.
* Work with the HTML Canvas API.
* Create an engaging and responsive user interface.
* Demonstrate multiplayer application development.

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome!

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Open a Pull Request.

---

## 📄 License

This project is available for educational and personal use.

---

## 👩‍💻 Author

**Bhv**

Built with 🎨 creativity, 💻 code, and 🧸 a little bit of cuteness.

---

⭐ If you like Cuddle Canvas, consider giving the repository a star!
