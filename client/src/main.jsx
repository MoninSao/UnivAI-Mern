import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import Profile from "./components/Profile";
import ProfileList from "./components/ProfileList";
import UniversityDeck from "./components/UniversityDeck";
import Recommendations from "./components/Recommendations";
import "./index.css";

// using react router dom here 
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProfileList />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/universities",
    element: <App />,
    children: [
      {
        path: "/universities",
        element: <UniversityDeck />,
      },
    ],
  },
  {
    path: "/recommendations",
    element: <App />,
    children: [
      {
        path: "/recommendations",
        element: <Recommendations />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
