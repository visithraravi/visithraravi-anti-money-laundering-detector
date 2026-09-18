# 🛡️ AMLens: AI-Powered Anti-Money-Laundering Investigation System

> **From an alert to an understandable investigation story.**  
> Built for automated financial crime detection, graph-based link analysis, and explainable evidence generation.

---

## 🎯 Problem Statement
Traditional transaction monitoring relies on isolated rule-based alerts that generate massive false positives and fail to uncover hidden laundering rings. Individual transactions look normal ($A \to B \to C \to D$), but the **connected relationship network** reveals the suspicious activity.

---

## 🚀 Our Solution: Graph-Based AI Investigation
Our system integrates machine learning with network graph analysis to transition from simple risk scores to complete, explainable investigation cases.

### Core 5-Word Pipeline
> **CONNECT ➔ DETECT ➔ TRACE ➔ EXPLAIN ➔ INVESTIGATE**

---

## 🏗️ System Architecture
```text
Transaction Dataset
       ↓
Data Preprocessing
       ↓
Feature Extraction
       ↓
AI Anomaly Detection (Isolation Forest)
       ↓
Anomalous Transactions
       ↓
Build Transaction Graph
       ↓
Cycle + Path Analysis
       ↓
Suspicious Network (A102 → B204 → C311 → D415 → A102)
       ↓
Money Trail & Evidence Extraction
       ↓
Investigation Case


