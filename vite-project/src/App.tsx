import React from "react";
import { Suspense, lazy } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import FileUpload from "./components/FileUpload";
import BucketList from "./components/BucketList";

const Card = lazy(() => import("./Card"));

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <Suspense fallback={<p>Loading card component...</p>}>
        <Card />
      </Suspense>

      <BucketList />
      <FileUpload bucket="your-default-bucket-name" />

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
