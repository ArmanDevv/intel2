# IntelliClass Project

IntelliClass is an AI-powered Learning Management platform designed to reduce manual efforts for both teachers and students. The platform processes uploaded study materials, converts them into structured learning resources, and automates repetitive academic workflows.

---

## Project Overview

IntelliClass leverages modern AI tools to:

* Convert uploaded PDFs into **assignments**, **flashcards**, and **summaries**.
* Allow students to upload their **syllabus** and generate a complete **YouTube playlist** automatically.
* Provide a seamless and interactive platform for learning enhancement.

Built using:

* **React.js** – Frontend
* **Node.js & Express.js** – Backend
* **MongoDB Atlas** – Database
* **Gemini API** – AI content generation
* **YouTube API** – Playlist recommendation

---

## Features

* PDF parsing and AI-generated study resources.
* Automated assignment and flashcard creation.
* Syllabus-based playlist generation.
* Clean, interactive dashboard for teachers and students.
* Scalable modular architecture.

---

## Tech Stack

* **Frontend**: React.js, Tailwind CSS
* **Backend**: Express.js, Node.js
* **Database**: MongoDB Atlas
* **APIs**: Gemini API, YouTube Data API

---

## How It Works

1. The teacher uploads a PDF.
2. The backend extracts text and sends it to Gemini API.
3. AI generates:

   * Assignments
   * Flashcards
   * Summary notes
4. Students upload syllabus topics.
5. System generates a topic‑wise YouTube playlist.
6. Everything is stored in MongoDB and displayed on the portal.

---

## Parsing Demo — Example Syllabus (Comma-Separated)

Below is a sample syllabus used for **testing YouTube parser functionality** in IntelliClass. This is included as demonstration content.

### **OOPS Topics (Comma Separated)**

Classes and Objects, Constructors and Destructors, Inheritance, Types of Inheritance, Polymorphism, Compile-time Polymorphism, Runtime Polymorphism, Function Overloading, Operator Overloading, Virtual Functions, Abstraction, Encapsulation, Interfaces, Abstract Classes, Access Modifiers, Static and Dynamic Binding, Object Lifetime, Memory Management in OOP, Exception Handling, Templates in C++, SOLID Principles

### **DBMS Topics (Comma Separated)**

DBMS Architecture, ER Model, Relational Model, Keys in DBMS, Normalization, Functional Dependencies, SQL Queries, Joins, Aggregate Functions, Subqueries, Views, Indexing, Transactions, ACID Properties, Concurrency Control, Deadlock, Locking Mechanisms, File Organization, Query Processing, NoSQL vs SQL, Stored Procedures, Triggers

### **Computer Networks Topics (Comma Separated)**

OSI Model, TCP/IP Model, Physical Layer Concepts, Data Link Layer, MAC Addressing, ARP, Switches, Hubs, Routing, Routing Algorithms, IP Addressing, Subnetting, IPv4, IPv6, TCP, UDP, Congestion Control, DNS, DHCP, HTTP, HTTPS, SMTP, FTP, Error Detection, Error Correction, CRC, Flow Control, Network Security Basics, Firewalls, VPN

### **Operating Systems Topics (Comma Separated)**

Types of Operating Systems, Process, Process States, Process Control Block, Threads, Multithreading, CPU Scheduling Algorithms, FCFS, SJF, Round Robin, Priority Scheduling, Deadlocks, Deadlock Prevention, Deadlock Avoidance, Deadlock Detection, Memory Management, Paging, Segmentation, Virtual Memory, Demand Paging, Page Faults, Page Replacement Algorithms, File Systems, Disk Scheduling, Synchronization, Semaphores, Mutex, Monitors

---

## Installation

```bash
git clone https://github.com/ArmanDevv/intel2.git
cd intel2
npm install
```

### Run Backend

```bash
cd server
npm install
npm start
```

### Run Frontend

```bash
cd client
npm install
npm run dev
```
--- 

Made by Deepti Chincholi, Arman Singh, and Aran Pahwa
