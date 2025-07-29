# System Design Diagram: Dengue Outbreak Prediction System

```mermaid
flowchart TD
    %% Data Sources
    subgraph Data_Sources
        A1[Dengue Case Data]
        A2[Land Use Data]
        A3[Weather Station Data]
    end

    %% Data Processing
    subgraph Data_Processing
        B1[Jupyter Notebook & Feature Engineering]
        B2[Processed Data]
        B3[Trained Model]
    end

    %% Backend API
    subgraph Backend_API
        C1[FastAPI Server]
        C2[Prediction & Stats Endpoints]
        C3[Dynamic Risk Map Generation]
    end

    %% Frontend
    subgraph Frontend
        D1[React Dashboard]
        D2[User Input Postal Code]
        D3[Display Results & Maps]
    end

    %% Deployment
    subgraph Deployment
        E1[Docker Containerization]
    end

    %% Data flow
    A1 --> B1
    A2 --> B1
    A3 --> B1
    B1 --> B2
    B1 --> B3
    B2 --> C1
    B3 --> C1
    C1 --> C2
    C1 --> C3
    D2 --> C2
    C2 --> D3
    C3 --> D3
    D1 --> D2
    D1 --> D3
    C1 --> E1
    D1 --> E1
```
```

**Instructions:**  
- Make sure the code block starts with three backticks and `mermaid` (as above).
- Each node is now on its own line, which resolves the parse error.
- Save and preview in VSCode with the Mermaid extension.

Let me know if you need any more help!