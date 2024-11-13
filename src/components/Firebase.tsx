import React, { useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQZwZtVJmV0_0tTA1LsoejsZtPii9oczY",
  authDomain: "loan-management-43f5d.firebaseapp.com",
  projectId: "loan-management-43f5d",
  storageBucket: "loan-management-43f5d.firebasestorage.app",
  messagingSenderId: "899276566842",
  appId: "1:899276566842:web:6634599539d86f52f92003",
  measurementId: "G-PW1D7X359H"
};

// Initialize Firebase and Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);