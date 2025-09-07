import { useEffect } from "react";

const Footer = () => {
  useEffect(() => {
    // Ensure footer stays at the bottom
    const setFooterPosition = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.style.position = window.innerHeight > document.body.offsetHeight ? "fixed" : "relative";
        footer.style.width = "100%";
        footer.style.bottom = "0";
      }
    };

    setFooterPosition();
    window.addEventListener("resize", setFooterPosition);
    return () => window.removeEventListener("resize", setFooterPosition);
  }, []);

  return (
    <footer className=" text-white text-center py-4">
      <p>Copyright built by Mitchyugan © {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;