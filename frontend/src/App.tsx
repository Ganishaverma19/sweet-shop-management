import { useEffect, useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import SplashScreen from "./pages/Splash";
import { Toaster } from "react-hot-toast";
import "./index.css";



function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);
  
   
  useEffect(() => {
  const cursor = document.querySelector(".custom-cursor") as HTMLDivElement;

  if (!cursor) return;

  const move = (e: MouseEvent) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  };

  const grow = () => {
  cursor.style.width = "30px";
  cursor.style.height = "30px";
  cursor.style.background = "rgba(255,255,255,0.7)";
  cursor.style.boxShadow =
    "0 0 12px rgba(255,255,255,0.9), 0 0 35px rgba(56,189,248,0.9), 0 0 70px rgba(56,189,248,0.5)";
};

const shrink = () => {
  cursor.style.width = "14px";
  cursor.style.height = "14px";
  cursor.style.background = "rgba(255,255,255,0.95)";
  cursor.style.boxShadow =
    "0 0 8px rgba(255,255,255,0.8), 0 0 20px rgba(56,189,248,0.6), 0 0 40px rgba(56,189,248,0.35)";
};


 const click = () => {
  cursor.style.transform = "translate(-50%, -50%) scale(0.7)";
  setTimeout(() => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
  }, 120);
};

  window.addEventListener("mousemove", move);
  window.addEventListener("mousedown", click);

  document.querySelectorAll("button, input").forEach((el) => {
    el.addEventListener("mouseenter", grow);
    el.addEventListener("mouseleave", shrink);
  });

  return () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mousedown", click);
  };
}, []);



  return (
    <>
      <Toaster position="top-right" />

      {showSplash ? (
        <SplashScreen visible />
      ) : loggedIn ? (
        <Dashboard />
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
       <div className="custom-cursor" />
    </>
  );
}

export default App;
