# RoutineIQ - System Architecture & Functional Summary

RoutineIQ is a clinical-grade, multi-agent AI skincare copilot powered by Alibaba Cloud Model Studio and deployed on Alibaba Cloud ECS. The system features a persistent cross-session memory engine that learns patient skincare history, tracks routine progress, scans ingredients for molecular compatibility, and refines recommendations over time.

---

## 1. System Architecture Diagram

Below is the complete internal system architecture depicting data flow, model dependencies, and memory cycles:

```mermaid
graph TD
    %% User and Client UI
    User([User Browser]) <--> |React UI / Tailwind| Client[Next.js Client Application]
    
    subgraph Client [Client UI Components]
        Dashboard[1. Patient Dashboard]
        UploadReport[2. Lab Report Scanner]
        Inventory[3. Product Inventory Shelf]
        Routine[4. Routine Timeline & Builder]
        Progress[5. Progress Chart Tracker]
        Chat[6. Ask AI Skincare Agent]
    end

    %% Routing and Authentication
    Client <--> |HTTPS / Auth Bearer Token| Gateway[Next.js API Gateway /api/*]
    Firebase[Firebase Authentication] <--> |Verify Token ID| Gateway

    %% Backend Engine and Databases
    subgraph Backend [Next.js Server API Routes]
        Gateway --> |Prisma ORM| DB[(ApsaraDB RDS MySQL Database)]
        
        %% Model studio connection
        Gateway --> |Compatible OpenAI Client| ModelStudio[Alibaba Cloud Model Studio Gateway]
        
        subgraph ModelStudio [Alibaba Cloud Model Studio Models]
            QwenText[qwen-plus<br/>Text Reasoning & Synthesis]
            QwenVision[qwen3.5-ocr<br/>Product Label Vision/OCR]
        end
    end

    %% Memory Loops
    subgraph MemoryEngine [Persistent Memory & Decision Loop]
        EpisodeLogger[Memory Episode Logger]
        EpisodeRetriever[Semantic Memory Context Retriever]
        
        Gateway <--> |action: add_episode| EpisodeLogger
        Gateway <--> |action: get_history / chat| EpisodeRetriever
        
        EpisodeLogger --> |Write Logs| DB
        EpisodeRetriever --> |Query Logs| DB
        
        %% Context Window Compaction
        Compactor[Context Compaction / Forgetting System]
        DB --> |Consolidate / Summarize| Compactor
        Compactor --> |Update Condensed Context| DB
    end

    %% Outer Connections
    QwenText <--> |Generate Insights & Advice| Gateway
    QwenVision <--> |Extract Ingredients & Phase| Gateway
```

---

## 2. Written Functional Summary

### Core Features

1. **AI Skincare Agent & Interactive Chat**
   * **Role**: A virtual cosmetic dermatologist with access to the user's complete clinical profiles, routine timelines, scanned products, and memory episodes.
   * **Behavior**: Uses the `qwen-plus` model to answer complex questions, recommend routine changes, and analyze compatibility. It can dynamically update the user's routines or log new skin progress observations directly from chat.

2. **Optical Character Recognition (OCR) Product Label Scanner**
   * **Role**: Analyzes uploaded photos of skincare products.
   * **Behavior**: Uses the `qwen3.5-ocr` vision model to extract the product name, application phase (e.g., Cleansing, Hydration, Treatment, Solar), key active ingredients (e.g., Niacinamide, Salicylic Acid, Ceramides), and calculate a molecular compatibility index based on the user's profile.
   * **Dynamic Fallback Presets**: If vision APIs are offline, it selects randomly from 10 popular real-world skincare products (like *CeraVe Hydrating Cleanser* or *The Ordinary Niacinamide*) to maintain a functional, organic UX.

3. **Persistent Memory Timeline (Cross-Session Experience)**
   * **Role**: Logs every key event (product addition, routine execution, lab report upload, skin condition change) into a permanent database timeline.
   * **Behavior**: When generating recommendations or answering questions, the system queries this timeline to recall critical historical context, remembering preferences and past adverse reactions across separate execution sessions.

4. **Multi-Step Skincare Journey Timeline**
   * **Role**: Connects all pages (Dashboard, Report Upload, Inventory Shelf, Routine Timeline, Progress Chart, Agent Chat) into a single, cohesive workflow.
   * **Behavior**: Seamlessly shares active profile context between components, allowing changes on one page to immediately reflect in the Agent's recommendations and the general dashboard state.

5. **Lab Report Analysis**
   * **Role**: Extracts diagnostic information from uploaded dermatological or blood reports.
   * **Behavior**: Analyzes markers (e.g., sebum levels, hydration indices, hormone balances) and updates the patient profile with targeted recommendations.

---

## 3. Persistent Memory & Context Compaction Design

### Memory Storage and Retrieval
Memory is logged as structured episodes (`MemoryEpisode` schema) containing:
- **Type**: `routine_completed`, `product_added`, `report_analyzed`, `chat_interaction`, `skin_update`.
- **Content**: Detailed text descriptions.
- **Timestamp**: Used for temporal sequencing.

When the user queries the agent, the backend runs a **Memory Context Retriever** that:
1. Queries the most recent episodes from the database.
2. Selects high-priority episodes (e.g., reports of skin irritation or allergy warnings) to ensure they are not forgotten.
3. Formats them into a structured system prompt context block: `[Memory & Experience Timeline]`.

### Context Compaction & Timely Forgetting
To fit inside limited context windows:
* **Compaction**: When the timeline grows too long, the system runs an offline/background summarization task using `qwen-plus`. It groups historical episodes into a single unified summary (e.g., *"Patient has a history of irritation with high-strength Retinol in month 1; transitioned successfully to Bakuchiol in month 2"*), deleting or archiving the raw, verbose logs while preserving the learned experiences.
* **Timely Forgetting**: Minor logs (e.g., daily chat pleasantries or routine execution checklists from 6 months ago) are flagged for automatic deletion or reduced retrieval weight once they exceed their relevance period.

---

## 4. Alibaba Cloud Deployment Architecture

RoutineIQ is hosted on **Alibaba Cloud ECS (Elastic Compute Service)** inside an Ubuntu 20.04/22.04 LTS instance, configured as follows:

1. **VPC Network Isolation**: The ECS server resides in the same Private VPC as the **ApsaraDB RDS Serverless (MySQL)** instance.
2. **Nginx Reverse Proxy**: Nginx listens on ports `80` (HTTP) and `443` (HTTPS) and proxies incoming web traffic to Next.js running locally on port `3000`.
3. **PM2 Process Manager**: PM2 manages the `npm start` service, maintaining high availability with automatic recovery on system reboots or runtime errors.
