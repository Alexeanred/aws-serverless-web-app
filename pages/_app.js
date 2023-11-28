import "../styles/globals.css";
import toast from "../components/Toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import styles from "../styles/Home.module.css"

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.body}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default MyApp;
